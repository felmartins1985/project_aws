import { z } from 'zod';
export const userUpdateSchema = z.object({
  enderecos: z.array(z.string(),{
    required_error: 'enderecos e obrigatorio',
  }),
  telefones: z.array(z.number(),{
    required_error: 'telefones e obrigatorio',
  }),
  livroId: z.array(z.string()),
})

export type UserUpdateInterface = z.infer<typeof userUpdateSchema>;

