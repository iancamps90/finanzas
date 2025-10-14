import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

export async function POST(
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

    if (report.status !== 'DRAFT') {
      return new NextResponse('Report is not in draft status', { status: 400 });
    }

    // Update report status to submitted
    const updatedReport = await prisma.taxReport.update({
      where: { id: params.id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error submitting tax report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
