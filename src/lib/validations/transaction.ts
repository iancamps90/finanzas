import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'El tipo de transacción es requerido',
  }),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  date: z.date({
    required_error: 'La fecha es requerida',
  }),
  description: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER', 'OTHER']).default('CARD'),
  tags: z.array(z.string()).default([]),
});

export const transactionFiltersSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER', 'OTHER']).optional(),
  tags: z.array(z.string()).optional(),
  q: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export const importTransactionSchema = z.object({
  file: z.instanceof(File, 'El archivo es requerido'),
  mapping: z.record(z.string(), z.string()),
  skipFirstRow: z.boolean().default(true),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
export type ImportTransactionInput = z.infer<typeof importTransactionSchema>;

