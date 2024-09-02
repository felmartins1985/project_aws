import { z } from 'zod';
export const userSchema = z.object({
  documento: z.string({
    required_error: 'documento é obrigatorio',
  }).refine(value => value.length === 11 || value.length === 14, {
    message: 'documento é um numero que tem que possuir 11 se for PF ou 14 se for PJ',
  }),
  tipo: z.string({
    required_error:'tipo e obrigatorio',
  }).length(2, 'tipo tem que ter 2 caracteres'),
  nome: z.string({
    required_error: 'nome é obrigatorio',
  }).min(3, 'nome tem que ter pelo menos 3 caracteres'),
  dataDeInicioOuNascimento: z.string({
    required_error: 'dataDeInicioOuNascimento e obrigatorio',
  }).date(),
  enderecos: z.array(z.string(),{
    required_error: 'enderecos e obrigatorio',
  }),
  telefones: z.array(z.number().min(8, 'telefone tem que ter pelo menos 8 numeros'),{
    required_error: 'telefones e obrigatorio',
  }),
  livroId: z.array(z.string()),
  tipoDeDados: z.string({
    required_error: 'tipoDeDados e obrigatorio',
  })
})

export type UserInterface = z.infer<typeof userSchema>;