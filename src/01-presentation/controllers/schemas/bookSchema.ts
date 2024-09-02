import { z } from 'zod';
export const bookSchema = z.object({
  nome: z.string({
    required_error:'nome é obrigatorio',
  }).min(3, 'nome tem que ter pelo menos 3 caracteres'),
  volumesDisponiveis: z.number().min(0, 'volumesDisponiveis tem que possuir no minimo 0'),
  volumesAlugados:z.number(),
  usuarioId: z.array(z.string()),
  tipoDeDados: z.string({
    required_error: 'typeDeDados é obrigatorio',
  })
})

export type BookInterface = z.infer<typeof bookSchema>;