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

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'raw';

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

    // Preparar datos para CSV
    const csvData = transactions.map(transaction => ({
      Fecha: transaction.date.toISOString().split('T')[0],
      Descripción: transaction.description,
      Categoría: transaction.category.name,
      Tipo: transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto',
      Monto: transaction.amount,
      'Método de Pago': transaction.paymentMethod,
      Etiquetas: transaction.tags || '',
      'Fecha de Creación': transaction.createdAt.toISOString().split('T')[0],
    }));

    const fields = [
      'Fecha',
      'Descripción', 
      'Categoría',
      'Tipo',
      'Monto',
      'Método de Pago',
      'Etiquetas',
      'Fecha de Creación'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transacciones-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}