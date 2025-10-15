import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { Parser } from 'json2csv';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Función para generar datos demo cuando no hay BD
function generateDemoTransactions() {
  const categories = [
    { id: '1', name: 'Alimentación', type: 'expense' },
    { id: '2', name: 'Transporte', type: 'expense' },
    { id: '3', name: 'Salario', type: 'income' },
    { id: '4', name: 'Freelance', type: 'income' },
    { id: '5', name: 'Entretenimiento', type: 'expense' },
  ];

  const transactions = [];
  const today = new Date();
  
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    transactions.push({
      id: `demo_${i + 1}`,
      date,
      description: `Transacción demo ${i + 1}`,
      amount: Math.floor(Math.random() * 1000) + 50,
      type: category.type,
      category,
      user: { id: 'demo_user', name: 'Usuario Demo' }
    });
  }
  
  return transactions;
}

// Endpoint público para demostración de Power BI
export async function GET(request: NextRequest) {
  try {
    // Verificar si el acceso público está habilitado
    if (process.env.BI_PUBLIC !== 'true') {
      return NextResponse.json({ error: 'Acceso público deshabilitado' }, { status: 403 });
    }

    // Obtener datos de demo o generar datos demo si no hay BD
    let transactions;
    try {
      transactions = await prisma.transaction.findMany({
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
    } catch (error) {
      // Si no hay base de datos, generar datos demo
      console.log('Generando datos demo para Power BI...');
      transactions = generateDemoTransactions();
    }

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
