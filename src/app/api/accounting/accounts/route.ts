import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Get user's companies
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId },
      include: { company: true },
    });

    if (userCompanies.length === 0) {
      return NextResponse.json({ accounts: [] });
    }

    const companyIds = userCompanies.map(uc => uc.companyId);

    // Get account plans for user's companies
    const accounts = await prisma.accountPlan.findMany({
      where: { 
        companyId: { in: companyIds },
        isActive: true
      },
      orderBy: { code: 'asc' },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching account plans:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
