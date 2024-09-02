import { typePK } from "src/04-infrastructure/item";
import { UserType } from "../userdefinition";

export type User = {
  documento: string;
  id: string;
  tipo: UserType;
  nome: string;
  dataDeInicioOuNascimento: string;
  enderecos: string[];
  telefones: number[];
  livroId: string[];
  tipoDeDados: typePK;
}