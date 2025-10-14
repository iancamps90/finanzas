import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const updateInvoiceSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerNIF: z.string().optional(),
  customerAddress: z.string().optional(),
  subtotal: z.number().positive('El subtotal debe ser positivo'),
  taxRate: z.number().min(0).max(100, 'El IVA debe estar entre 0 y 100'),
  notes: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateInvoiceSchema.parse(body);

    // Check if user has access to this invoice
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const invoice = await prisma.invoice.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Calculate amounts
    const taxAmount = (validatedData.subtotal * validatedData.taxRate) / 100;
    const total = validatedData.subtotal + taxAmount;

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customerName: validatedData.customerName,
        customerNIF: validatedData.customerNIF,
        customerAddress: validatedData.customerAddress,
        subtotal: validatedData.subtotal,
        taxRate: validatedData.taxRate,
        taxAmount: taxAmount,
        total: total,
        notes: validatedData.notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error updating invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Check if user has access to this invoice
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const invoice = await prisma.invoice.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Delete invoice
    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
