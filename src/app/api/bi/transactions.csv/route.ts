import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { Parser } from 'json2csv';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Preparar datos optimizados para Power BI
    const csvData = transactions.map(transaction => ({
      TransactionID: transaction.id,
      Date: transaction.date.toISOString().split('T')[0],
      Description: transaction.description,
      CategoryID: transaction.category.id,
      CategoryName: transaction.category.name,
      CategoryType: transaction.category.type,
      CategoryColor: transaction.category.color,
      TransactionType: transaction.type,
      Amount: transaction.amount,
      PaymentMethod: transaction.paymentMethod,
      Tags: transaction.tags || '',
      CreatedAt: transaction.createdAt.toISOString(),
      UpdatedAt: transaction.updatedAt.toISOString(),
    }));

    const fields = [
      'TransactionID',
      'Date',
      'Description',
      'CategoryID',
      'CategoryName',
      'CategoryType',
      'CategoryColor',
      'TransactionType',
      'Amount',
      'PaymentMethod',
      'Tags',
      'CreatedAt',
      'UpdatedAt'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="powerbi-transactions-${new Date().toISOString().split('T')[0]}.csv"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error exporting Power BI CSV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}