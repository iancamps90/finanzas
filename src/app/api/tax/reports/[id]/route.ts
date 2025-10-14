import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const updateReportSchema = z.object({
  type: z.enum(['IVA', 'IRPF', 'IS'], { required_error: 'El tipo es requerido' }),
  period: z.string().min(1, 'El período es requerido'),
  totalPayable: z.number().min(0, 'El total a pagar debe ser positivo'),
  totalReceivable: z.number().min(0, 'El total a cobrar debe ser positivo'),
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
    const validatedData = updateReportSchema.parse(body);

    // Check if user has access to this report
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const report = await prisma.taxReport.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!report) {
      return new NextResponse('Report not found', { status: 404 });
    }

    // Calculate net amount
    const netAmount = validatedData.totalPayable - validatedData.totalReceivable;

    // Update report
    const updatedReport = await prisma.taxReport.update({
      where: { id: params.id },
      data: {
        type: validatedData.type,
        period: validatedData.period,
        totalPayable: validatedData.totalPayable,
        totalReceivable: validatedData.totalReceivable,
        netAmount: netAmount,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error updating tax report:', error);
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
    // Check if user has access to this report
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
    });

    const companyIds = userCompanies.map(uc => uc.companyId);

    const report = await prisma.taxReport.findFirst({
      where: { 
        id: params.id,
        companyId: { in: companyIds }
      },
    });

    if (!report) {
      return new NextResponse('Report not found', { status: 404 });
    }

    // Delete report
    await prisma.taxReport.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tax report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
