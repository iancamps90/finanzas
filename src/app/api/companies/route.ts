import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const userCompanies = await prisma.userCompany.findMany({
      where: { userId: session.user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            cif: true,
          },
        },
      },
    });

    const companies = userCompanies.map(uc => ({
      id: uc.company.id,
      name: uc.company.name,
      cif: uc.company.cif,
      role: uc.role,
    }));

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
