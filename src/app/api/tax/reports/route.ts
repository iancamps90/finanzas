import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { z } from 'zod';

const createReportSchema = z.object({
  type: z.enum(['IVA', 'IRPF', 'IS'], { required_error: 'El tipo es requerido' }),
  period: z.string().min(1, 'El período es requerido'),
  totalPayable: z.number().min(0, 'El total a pagar debe ser positivo'),
  totalReceivable: z.number().min(0, 'El total a cobrar debe ser positivo'),
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
        reports: [], 
        stats: { 
          totalReports: 0, 
          totalPayable: 0, 
          totalReceivable: 0, 
          netAmount: 0, 
          pendingReports: 0 
        } 
      });
    }

    const companyIds = userCompanies.map(uc => uc.companyId);

    // Get tax reports for user's companies
    const reports = await prisma.taxReport.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const totalPayable = reports.reduce((sum, report) => sum + report.totalPayable, 0);
    const totalReceivable = reports.reduce((sum, report) => sum + report.totalReceivable, 0);
    const netAmount = totalPayable - totalReceivable;
    const pendingReports = reports.filter(report => report.status === 'DRAFT').length;

    const stats = {
      totalReports: reports.length,
      totalPayable,
      totalReceivable,
      netAmount,
      pendingReports,
    };

    return NextResponse.json({ reports, stats });
  } catch (error) {
    console.error('Error fetching tax reports:', error);
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
    const validatedData = createReportSchema.parse(body);

    // Get user's first company (for now, we'll use the first one)
    const userCompany = await prisma.userCompany.findFirst({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!userCompany) {
      return new NextResponse('No company found', { status: 400 });
    }

    // Calculate net amount
    const netAmount = validatedData.totalPayable - validatedData.totalReceivable;

    // Create tax report
    const report = await prisma.taxReport.create({
      data: {
        companyId: userCompany.companyId,
        type: validatedData.type,
        period: validatedData.period,
        totalPayable: validatedData.totalPayable,
        totalReceivable: validatedData.totalReceivable,
        netAmount: netAmount,
        status: 'DRAFT',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.error('Error creating tax report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
