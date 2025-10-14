import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const createInvoiceSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerNIF: z.string().optional(),
  customerAddress: z.string().optional(),
  subtotal: z.number().positive('El subtotal debe ser positivo'),
  taxRate: z.number().min(0).max(100, 'El IVA debe estar entre 0 y 100'),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get user's companies
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (userCompanies.length === 0) {
      return NextResponse.json({ invoices: [], stats: { totalInvoices: 0, totalAmount: 0, pendingAmount: 0, paidAmount: 0 } });
    }

    const companyIds = userCompanies.map(uc => uc.companyId);

    // Get invoices for user's companies
    const invoices = await prisma.invoice.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const stats = {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
      pendingAmount: invoices
        .filter(invoice => invoice.status === 'ISSUED')
        .reduce((sum, invoice) => sum + invoice.total, 0),
      paidAmount: invoices
        .filter(invoice => invoice.status === 'PAID')
        .reduce((sum, invoice) => sum + invoice.total, 0),
    };

    return NextResponse.json({ invoices, stats });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    // Get user's first company (for now, we'll use the first one)
    const userCompany = await prisma.userCompany.findFirst({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!userCompany) {
      return new NextResponse('No company found', { status: 400 });
    }

    // Get next invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { 
        companyId: userCompany.companyId,
        series: 'A'
      },
      orderBy: { number: 'desc' },
    });

    const nextNumber = lastInvoice ? (parseInt(lastInvoice.number) + 1).toString().padStart(3, '0') : '001';

    // Calculate amounts
    const taxAmount = (validatedData.subtotal * validatedData.taxRate) / 100;
    const total = validatedData.subtotal + taxAmount;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        companyId: userCompany.companyId,
        number: nextNumber,
        series: 'A',
        customerName: validatedData.customerName,
        customerNIF: validatedData.customerNIF,
        customerAddress: validatedData.customerAddress,
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        subtotal: validatedData.subtotal,
        taxRate: validatedData.taxRate,
        taxAmount: taxAmount,
        total: total,
        status: 'DRAFT',
        notes: validatedData.notes,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error creating invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
