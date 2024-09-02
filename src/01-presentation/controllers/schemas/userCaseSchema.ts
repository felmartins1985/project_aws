import { z } from 'zod';
export const userCaseSchema = z.object({
  pkUsuario: z.string({
    required_error:'pkUsuario é obrigatorio',
  }),
  pkLivro: z.string({
    required_error: 'pkLivro é obrigatorio',
  }),
})

export type UserCaseInterface = z.infer<typeof userCaseSchema>;