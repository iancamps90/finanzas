import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const updateEntrySchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
  debitAccount: z.string().min(1, 'La cuenta debe es requerida'),
  creditAccount: z.string().min(1, 'La cuenta haber es requerida'),
  amount: z.number().positive('El importe debe ser positivo'),
  reference: z.string().optional(),
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
    const validatedData = updateEntrySchema.parse(body);

    // Check if user has access to this entry
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const entry = await prisma.accountingEntry.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!entry) {
      return new NextResponse('Entry not found', { status: 404 });
    }

    // Update entry
    const updatedEntry = await prisma.accountingEntry.update({
      where: { id: params.id },
      data: {
        date: new Date(validatedData.date),
        description: validatedData.description,
        debitAccount: validatedData.debitAccount,
        creditAccount: validatedData.creditAccount,
        amount: validatedData.amount,
        reference: validatedData.reference,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error updating accounting entry:', error);
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
    // Check if user has access to this entry
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const entry = await prisma.accountingEntry.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!entry) {
      return new NextResponse('Entry not found', { status: 404 });
    }

    // Delete entry
    await prisma.accountingEntry.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting accounting entry:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
