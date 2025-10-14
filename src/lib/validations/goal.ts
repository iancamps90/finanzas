import { z } from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, 'El nombre del objetivo es requerido'),
  targetAmount: z.number().positive('El monto objetivo debe ser positivo'),
  currentAmount: z.number().min(0).default(0),
  deadline: z.date().optional(),
});

export type GoalInput = z.infer<typeof goalSchema>;

