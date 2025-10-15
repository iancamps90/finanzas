import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

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

    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Estructura optimizada para Power BI
    const dataset = {
      metadata: {
        generatedAt: new Date().toISOString(),
        userId: session.user.id,
        totalTransactions: transactions.length,
        totalCategories: categories.length,
      },
      categories: categories.map(category => ({
        CategoryID: category.id,
        Name: category.name,
        Type: category.type,
        Color: category.color,
        CreatedAt: category.createdAt.toISOString(),
      })),
      transactions: transactions.map(transaction => ({
        TransactionID: transaction.id,
        Date: transaction.date.toISOString().split('T')[0],
        Description: transaction.description,
        CategoryID: transaction.category.id,
        TransactionType: transaction.type,
        Amount: transaction.amount,
        PaymentMethod: transaction.paymentMethod,
        Tags: transaction.tags || '',
        CreatedAt: transaction.createdAt.toISOString(),
        UpdatedAt: transaction.updatedAt.toISOString(),
      })),
      summary: {
        totalIncome: transactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0),
        balance: transactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0) - 
          transactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0),
      }
    };

    return NextResponse.json(dataset, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="powerbi-dataset-${new Date().toISOString().split('T')[0]}.json"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error exporting Power BI JSON:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}