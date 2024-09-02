import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().email({
    message: 'login é em formato de email e é obrigatório',
  }),
  password: z.string().min(6, 'Senha tem que ter pelo menos 6 caracteres'),
});

export type LoginUser = z.infer<typeof loginSchema>;