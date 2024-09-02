import { typePK } from "src/04-infrastructure/item";

export type Book = {
  nome: string;
  id: string;
  volumesDisponiveis: number;
  volumesAlugados: number; 
  usuarioId: string[];
  tipoDeDados: typePK;
  autor?: string,
}