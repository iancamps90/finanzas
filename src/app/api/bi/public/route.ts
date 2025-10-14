import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { Parser } from 'json2csv';

// Endpoint público para demostración de Power BI
export async function GET(request: NextRequest) {
  try {
    // Verificar si el acceso público está habilitado
    if (process.env.BI_PUBLIC !== 'true') {
      return NextResponse.json({ error: 'Acceso público deshabilitado' }, { status: 403 });
    }

    // Obtener datos de demo (primeros 100 registros de cualquier usuario)
    const transactions = await prisma.transaction.findMany({
      take: 100,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Preparar datos anonimizados para demo
    const csvData = transactions.map(transaction => ({
      TransactionID: `DEMO_${transaction.id}`,
      Date: transaction.date.toISOString().split('T')[0],
      Description: transaction.description || 'Transacción de ejemplo',
      CategoryName: transaction.category.name,
      CategoryType: transaction.category.type,
      TransactionType: transaction.type,
      Amount: transaction.amount,
      PaymentMethod: transaction.paymentMethod,
      Tags: transaction.tags || '',
      CreatedAt: transaction.createdAt.toISOString(),
    }));

    const fields = [
      'TransactionID',
      'Date',
      'Description',
      'CategoryName',
      'CategoryType',
      'TransactionType',
      'Amount',
      'PaymentMethod',
      'Tags',
      'CreatedAt'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="powerbi-demo-data.csv"',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });
  } catch (error) {
    console.error('Error exporting public demo CSV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
