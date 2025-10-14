import { Parser } from 'json2csv';
import Papa from 'papaparse';
import { Transaction, Category } from '@prisma/client';

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface CSVTransaction {
  id: string;
  fecha: string;
  tipo: string;
  categoria: string;
  monto: number;
  descripcion: string;
  metodo_pago: string;
  etiquetas: string;
  creado: string;
}

export interface RawCSVTransaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  paymentMethod: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: string;
    color: string;
  };
}

export function generateCuratedCSV(transactions: TransactionWithCategory[]): string {
  const curatedData: CSVTransaction[] = transactions.map(transaction => ({
    id: transaction.id,
    fecha: transaction.date.toISOString().split('T')[0],
    tipo: transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto',
    categoria: transaction.category.name,
    monto: Number(transaction.amount),
    descripcion: transaction.description || '',
    metodo_pago: getPaymentMethodLabel(transaction.paymentMethod),
    etiquetas: transaction.tags.join(', '),
    creado: transaction.createdAt.toISOString(),
  }));

  const fields = [
    { label: 'ID', value: 'id' },
    { label: 'Fecha', value: 'fecha' },
    { label: 'Tipo', value: 'tipo' },
    { label: 'Categoría', value: 'categoria' },
    { label: 'Monto', value: 'monto' },
    { label: 'Descripción', value: 'descripcion' },
    { label: 'Método de Pago', value: 'metodo_pago' },
    { label: 'Etiquetas', value: 'etiquetas' },
    { label: 'Creado', value: 'creado' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(curatedData);
}

export function generateRawCSV(transactions: TransactionWithCategory[]): string {
  const rawData: RawCSVTransaction[] = transactions.map(transaction => ({
    id: transaction.id,
    userId: transaction.userId,
    categoryId: transaction.categoryId,
    amount: Number(transaction.amount),
    type: transaction.type,
    date: transaction.date.toISOString(),
    description: transaction.description || '',
    paymentMethod: transaction.paymentMethod,
    tags: JSON.stringify(transaction.tags),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      type: transaction.category.type,
      color: transaction.category.color,
    },
  }));

  const parser = new Parser();
  return parser.parse(rawData);
}

export function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Error parsing CSV: ${results.errors[0].message}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function validateCSVData(data: any[], mapping: Record<string, string>): string[] {
  const errors: string[] = [];
  const requiredFields = ['amount', 'type', 'categoryId', 'date'];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2; // +2 because CSV is 1-indexed and we skip header

    // Check required fields
    for (const field of requiredFields) {
      const csvField = mapping[field];
      if (!csvField || !row[csvField]) {
        errors.push(`Fila ${rowNumber}: Campo requerido '${field}' no encontrado`);
      }
    }

    // Validate amount
    if (row[mapping.amount] && isNaN(Number(row[mapping.amount]))) {
      errors.push(`Fila ${rowNumber}: El monto debe ser un número válido`);
    }

    // Validate type
    if (row[mapping.type] && !['INCOME', 'EXPENSE'].includes(row[mapping.type])) {
      errors.push(`Fila ${rowNumber}: El tipo debe ser 'INCOME' o 'EXPENSE'`);
    }

    // Validate date
    if (row[mapping.date] && isNaN(Date.parse(row[mapping.date]))) {
      errors.push(`Fila ${rowNumber}: La fecha debe ser válida`);
    }
  }

  return errors;
}

export function transformCSVData(data: any[], mapping: Record<string, string>): any[] {
  return data.map(row => {
    const transformed: any = {};

    // Map basic fields
    if (mapping.amount) transformed.amount = Number(row[mapping.amount]);
    if (mapping.type) transformed.type = row[mapping.type];
    if (mapping.categoryId) transformed.categoryId = row[mapping.categoryId];
    if (mapping.date) transformed.date = new Date(row[mapping.date]);
    if (mapping.description) transformed.description = row[mapping.description];
    if (mapping.paymentMethod) transformed.paymentMethod = row[mapping.paymentMethod];
    if (mapping.tags) {
      const tags = row[mapping.tags];
      transformed.tags = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];
    }

    return transformed;
  });
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    CARD: 'Tarjeta',
    CASH: 'Efectivo',
    TRANSFER: 'Transferencia',
    OTHER: 'Otro',
  };
  return labels[method] || method;
}

export function generatePowerBICSV(transactions: TransactionWithCategory[]): string {
  const powerBIData = transactions.map(transaction => ({
    // Date fields for Power BI
    Date: transaction.date.toISOString().split('T')[0],
    Year: transaction.date.getFullYear(),
    Month: transaction.date.getMonth() + 1,
    MonthName: transaction.date.toLocaleDateString('es-ES', { month: 'long' }),
    Quarter: Math.ceil((transaction.date.getMonth() + 1) / 3),
    DayOfWeek: transaction.date.getDay(),
    DayOfWeekName: transaction.date.toLocaleDateString('es-ES', { weekday: 'long' }),
    
    // Transaction data
    TransactionId: transaction.id,
    Type: transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto',
    Amount: Number(transaction.amount),
    Category: transaction.category.name,
    CategoryType: transaction.category.type === 'INCOME' ? 'Ingreso' : 'Gasto',
    Description: transaction.description || '',
    PaymentMethod: getPaymentMethodLabel(transaction.paymentMethod),
    Tags: transaction.tags.join(', '),
    
    // Calculated fields
    IsIncome: transaction.type === 'INCOME',
    IsExpense: transaction.type === 'EXPENSE',
    AmountAbs: Math.abs(Number(transaction.amount)),
  }));

  const parser = new Parser();
  return parser.parse(powerBIData);
}

