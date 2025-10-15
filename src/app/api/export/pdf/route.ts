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

    // Calcular totales
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Crear HTML simple para PDF (esto es un ejemplo básico)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Transacciones</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .summary-item { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .positive { color: green; }
            .negative { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Transacciones</h1>
            <p>Generado el: ${new Date().toLocaleDateString('es-ES')}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <h3>Total Ingresos</h3>
              <p class="positive">€${totalIncome.toFixed(2)}</p>
            </div>
            <div class="summary-item">
              <h3>Total Gastos</h3>
              <p class="negative">€${totalExpense.toFixed(2)}</p>
            </div>
            <div class="summary-item">
              <h3>Balance</h3>
              <p class="${balance >= 0 ? 'positive' : 'negative'}">€${balance.toFixed(2)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${transaction.date.toLocaleDateString('es-ES')}</td>
                  <td>${transaction.description}</td>
                  <td>${transaction.category.name}</td>
                  <td>${transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto'}</td>
                  <td class="${transaction.type === 'INCOME' ? 'positive' : 'negative'}">
                    €${transaction.amount.toFixed(2)}
                  </td>
                  <td>${transaction.paymentMethod}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="reporte-${new Date().toISOString().split('T')[0]}.html"`,
      },
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}