import { z } from 'zod';

export const budgetSchema = z.object({
  categoryId: z.string().optional(),
  period: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2020).max(2030),
  amount: z.number().positive('El monto debe ser positivo'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

