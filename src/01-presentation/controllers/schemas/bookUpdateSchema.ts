import { z } from 'zod';
export const bookUpdateSchema = z.object({
  volumesDisponiveis: z.number().min(0, 'volumesDisponiveis tem que ter no minimo 0'),
  volumesAlugados:z.number(),
  usuarioId: z.array(z.string()),
})

export type BookInterface = z.infer<typeof bookUpdateSchema>;