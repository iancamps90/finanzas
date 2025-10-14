import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with real data from API
const mockTransactions = [
  {
    id: '1',
    description: 'Compra en supermercado',
    amount: -85.50,
    type: 'EXPENSE' as const,
    category: 'Supermercado',
    date: new Date('2024-01-15'),
    paymentMethod: 'CARD' as const,
  },
  {
    id: '2',
    description: 'Salario mensual',
    amount: 2500.00,
    type: 'INCOME' as const,
    category: 'Nómina',
    date: new Date('2024-01-14'),
    paymentMethod: 'TRANSFER' as const,
  },
  {
    id: '3',
    description: 'Gasolina',
    amount: -45.20,
    type: 'EXPENSE' as const,
    category: 'Transporte',
    date: new Date('2024-01-13'),
    paymentMethod: 'CARD' as const,
  },
  {
    id: '4',
    description: 'Cena restaurante',
    amount: -32.80,
    type: 'EXPENSE' as const,
    category: 'Ocio',
    date: new Date('2024-01-12'),
    paymentMethod: 'CARD' as const,
  },
  {
    id: '5',
    description: 'Freelance proyecto',
    amount: 800.00,
    type: 'INCOME' as const,
    category: 'Freelance',
    date: new Date('2024-01-11'),
    paymentMethod: 'TRANSFER' as const,
  },
];

export function RecentTransactions() {
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-primary" />
          Transacciones Recientes
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">Ver todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((transaction, index) => {
            const isIncome = transaction.type === 'INCOME';
            const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                      isIncome
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date, 'es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-semibold ${
                      isIncome ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {isIncome ? '+' : ''}
                    {formatCurrency(transaction.amount, 'EUR', 'es-ES')}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
