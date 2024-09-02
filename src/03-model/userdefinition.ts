import {User as UserInterface} from 'src/03-model/interface/userType';
import crypto from 'crypto';
import { typePK } from 'src/04-infrastructure/item';
import { BookDefinition } from './bookdefinition';
import {  isUUID, isString, isNumber } from 'class-validator';
export type UserType = 'PF' | 'PJ';
export class UserDefinition{
  readonly documento: string;
  readonly tipo: UserType;
  readonly nome: string;
  readonly id: string;
  readonly dataDeInicioOuNascimento: string;
  readonly enderecos: string[];
  readonly telefones: number[];
  readonly livroId: string[];
  readonly tipoDeDados: typePK;
  constructor(user: UserInterface){
    this.documento = user.documento;
    this.tipo = user.tipo;
    this.nome = user.nome;
    this.id = user.id || crypto.randomUUID();
    this.dataDeInicioOuNascimento = user.dataDeInicioOuNascimento;
    this.enderecos = user.enderecos;
    this.telefones = user.telefones;
    this.livroId = user.livroId;
    this.tipoDeDados = user.tipoDeDados;
    this.validate();
  } 
  static manufacture(user: UserInterface): UserDefinition{
    return new UserDefinition(user);
  }
  private validate(): void {
    const erros = [];
    if(!isUUID(this.id)){
      erros.push(new Error("Invalido UUID no id"));
    }
    if(!isString(this.nome) || this.nome.length < 3){
      erros.push(new Error("Nome invalido"));
    }
    if(!isString(this.dataDeInicioOuNascimento) || this.dataDeInicioOuNascimento.length == 0){
      erros.push(new Error("Data de nascimento invalido"));
    }
    if(!isString(this.documento) || (this.documento.length !=11 && this.documento.length != 14)){
      erros.push(new Error("Documento invalido"));
    }
    if(!isString(this.tipo) || (this.tipo !== "PF" && this.tipo !== "PJ")){
      erros.push(new Error("tipo invalido"));
    }
    if(!isString(this.tipoDeDados) || this.tipoDeDados !== "USUARIO"){
      erros.push(new Error("Tipo de dados invalido"));
    }
    if (!Array.isArray(this.enderecos) || this.enderecos.some(endereco => !isString(endereco) || endereco.trim() === "")) {
      erros.push(new Error("Endereços invalidos"));
    }
    if (!Array.isArray(this.telefones) || this.telefones.some(telefone => !isNumber(telefone) || telefone.toString().length < 8)) {
      erros.push(new Error("Telefones invalidos"));
    }
    if (!Array.isArray(this.livroId)) {
      erros.push(new Error("LivroId invalidos"));
    }
    if(erros.length > 0){
      throw new Error(erros.map(e => e.toString()).join(", "));
    }
  }
  public addLivro(livroId: BookDefinition): void {
    if(!this.livroId.find(id => id == livroId.id)){
      this.livroId.push(livroId.id);
    }
  }
  public removeLivro(livroId: BookDefinition): void {
    const index = this.livroId.indexOf(livroId.id);
    if(index!== -1){
      this.livroId.splice(index, 1);
    }
  }
}