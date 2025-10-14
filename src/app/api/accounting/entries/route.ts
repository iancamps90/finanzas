import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const createEntrySchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
  debitAccount: z.string().min(1, 'La cuenta debe es requerida'),
  creditAccount: z.string().min(1, 'La cuenta haber es requerida'),
  amount: z.number().positive('El importe debe ser positivo'),
  reference: z.string().optional(),
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
      return NextResponse.json({ 
        entries: [], 
        stats: { totalEntries: 0, totalDebit: 0, totalCredit: 0, balance: 0 } 
      });
    }

    const companyIds = userCompanies.map(uc => uc.companyId);

    // Get accounting entries for user's companies
    const entries = await prisma.accountingEntry.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { date: 'desc' },
    });

    // Calculate stats
    const totalDebit = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const balance = totalDebit - totalCredit;

    const stats = {
      totalEntries: entries.length,
      totalDebit,
      totalCredit,
      balance,
    };

    return NextResponse.json({ entries, stats });
  } catch (error) {
    console.error('Error fetching accounting entries:', error);
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
    const validatedData = createEntrySchema.parse(body);

    // Get user's first company (for now, we'll use the first one)
    const userCompany = await prisma.userCompany.findFirst({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!userCompany) {
      return new NextResponse('No company found', { status: 400 });
    }

    // Create accounting entry
    const entry = await prisma.accountingEntry.create({
      data: {
        companyId: userCompany.companyId,
        date: new Date(validatedData.date),
        description: validatedData.description,
        debitAccount: validatedData.debitAccount,
        creditAccount: validatedData.creditAccount,
        amount: validatedData.amount,
        reference: validatedData.reference,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error creating accounting entry:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
