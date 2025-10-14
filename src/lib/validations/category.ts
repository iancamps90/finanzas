import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre de la categoría es requerido'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'El tipo de categoría es requerido',
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color inválido').default('#3B82F6'),
});

export type CategoryInput = z.infer<typeof categorySchema>;

