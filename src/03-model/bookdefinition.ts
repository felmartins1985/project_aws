import {Book as BookInterface} from 'src/03-model/interface/bookType';
import crypto from 'crypto';
import { typePK } from 'src/04-infrastructure/item';
import { isUUID, isString, isNumber } from 'class-validator';
import { UserDefinition } from './userdefinition';
export class BookDefinition{
  readonly id: string;
  readonly nome: string;
  readonly autor: string;
  public volumesDisponiveis: number;
  public volumesAlugados: number;
  public usuarioId: string[];
  readonly tipoDeDados: typePK;
  constructor(book: BookInterface){
    this.nome = book.nome;
    this.autor = book.autor;
    this.id = book.id || crypto.randomUUID();
    this.volumesDisponiveis = book.volumesDisponiveis;
    this.volumesAlugados = book.volumesAlugados;
    this.usuarioId = book.usuarioId;
    this.tipoDeDados = book.tipoDeDados;
    this.validate();
  };

  static manufacture(book: BookInterface): BookDefinition{
    return new BookDefinition(book);
  };
  private validate(): void {
    const erros = [];
    if(!isUUID(this.id)){
      erros.push(new Error("Invalido UUID no id"));
    }
    if(!isString(this.nome) || this.nome.length < 3){
      erros.push(new Error("Nome invalido"));
    }
    if(!isString(this.autor) || this.autor.length < 3){
      erros.push(new Error("Autor invalido"));
    }
    if(!isNumber(this.volumesDisponiveis) || this.volumesDisponiveis < 0){
      erros.push(new Error("Volumes disponiveis invalido"));
    }
    if(!isNumber(this.volumesAlugados) || this.volumesAlugados < 0){
      erros.push(new Error("Volumes alugados invalido"));
    }
    if(!isString(this.tipoDeDados) || (this.tipoDeDados !== "LIVRO" && this.tipoDeDados !== "USUARIO")){
      erros.push(new Error("Tipo de dados invalido"));
    }
    if (!Array.isArray(this.usuarioId)) {
      erros.push(new Error("LivroId invalidos"));
    }
    if(erros.length > 0){
      throw new Error(erros.map(e => e.toString()).join(", "));
    }
  }
  public addUsuario(user: UserDefinition): void {
    if(!this.usuarioId.find(u => u == user.id)){
      this.usuarioId.push(user.id);
      this.volumesDisponiveis--;
      this.volumesAlugados++;
    }
  };
  public removeUsuario(user: UserDefinition): void {
    const index = this.usuarioId.indexOf(user.id);
    if(index!== -1){
      this.usuarioId.splice(index, 1);
      this.volumesDisponiveis++;
      this.volumesAlugados--;
    }
  }
}