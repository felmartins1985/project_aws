import { z } from "zod";


export const roleSchema = z.object({
  role: z.string(),
  org: z.string(),
});

export type RoleUser = z.infer<typeof roleSchema>;

export const registerCognitoUserSchema = z.object({
  nome: z.string({
    required_error: "Nome é obrigatório",
  }).min(3, "Nome tem que ter pelo menos 3 caracteres"),
  email: z.string().email({
    message: "Formato de email inválido",
  }),
  password: z.string().min(6, "Senha tem que ter pelo menos 6 caracteres"),
  role: z.array(roleSchema,{
    required_error: "Role é obrigatório"
  }), 
});

export type RegisterCognitoUser = z.infer<typeof registerCognitoUserSchema>;
