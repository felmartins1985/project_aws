import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from 'src/02-services/interface/bookServiceInterface';
import {Book as BookInterface} from 'src/03-model/interface/bookType';
import {Users} from 'src/tests/unit/service/mocks/usersService';
import {mockWithUser, mockWithUserStatus} from 'src/tests/unit/controller/mocks/allUsersController';
import {User as UserInterface} from 'src/03-model/interface/userType';
import {ReturnService, ReturnServiceItem, UserServiceInterface} from 'src/02-services/interface/userServiceInterface'
import {UserBookController} from 'src/01-presentation/controllers/userBookController'
import { Request, Response } from 'express';
import { BookItem } from 'src/04-infrastructure/items/book-item';
import { UserItem } from 'src/04-infrastructure/items/user-item';

class DBTable implements DynamoTableInterface {
  client: any;
  tableName: string;
  putItem(item: any): Promise<boolean> {
    return Promise.resolve(true);
  }
  updateItem(params: any): Promise<boolean> {
    return Promise.resolve(true);
  }
  getItems(pk: string): Promise<any[]> {
    return Promise.resolve(Users);
  }
  getItem(pk: string, sk: string): Promise<any> {
    return Promise.resolve(Users[0])
  }
  query(params: any): Promise<any> {
    return Promise.resolve(mockWithUser)
  }
}

class BookService implements BookServiceInterface {
  tabela: DynamoTableInterface;
  countBook = 0;
  countBookCreate =0;
  public constructor(tabela: DynamoTableInterface){
    this.tabela = tabela;
  }
  public async createBook(book: BookInterface) : Promise<ReturnService> {
    throw new Error('Method not implemented.');
  }
  public async getById(pk: string) : Promise<ReturnServiceItem<BookItem>> {
    throw new Error('Method not implemented.');
  }
  public async getByName(pk: string) : Promise<ReturnServiceItem<BookItem>> { 
    throw new Error('Method not implemented.'); 
  }
  public async updateBook(updtBook: BookItem) : Promise<ReturnService> {
    throw new Error('Method not implemented.'); 
  }
}

class UserService implements UserServiceInterface{
  tabela: DynamoTableInterface;
  livro: BookServiceInterface;
  callCountCreateUser = 0;
  callCountGetById = 0;
  callCountGetByDocument = 0;
  callCountUpdateUser = 0;
  callCountTakeBook = 0;
  callCountReturnBook = 0;
  public constructor(tabela: DynamoTableInterface, livro: BookServiceInterface){
    this.tabela = tabela;
    this.livro = livro;
  }
  public  async createUser(user: UserInterface) : Promise<ReturnService> {
    if(this.callCountCreateUser === 0){
      this.callCountCreateUser++;
      throw new Error('erro ao tentar criar um usuario.');
    }
    return {
      status: true,
      message: 'Usuario criado'
    }
  }
  public async getById(id: string) : Promise<ReturnServiceItem<UserItem>>{
    if(this.callCountGetById === 0){
      this.callCountGetById++;
      throw new Error('erro ao tentar um usuario pelo id');  
    }
    if(this.callCountGetById === 1){
      this.callCountGetById++;
      return {
        status: true,
        error: 'Usuario nao achado'
      }
    }
    return {
      status: true,
      data: mockWithUser.Items[0] as UserItem
    }
  }
  public async getByDocument(id: string) : Promise<ReturnServiceItem<UserItem>> {
    if(this.callCountGetByDocument === 0){
      this.callCountGetByDocument++;
      throw new Error('erro ao tentar pegar um usuario pelo documento');  
    }
    if(this.callCountGetByDocument === 1){
      this.callCountGetByDocument++;
      return {
        status: true,
        error: 'Usuario nao achado'
      }
    }
    return {
      status: true,
      data: mockWithUser.Items[0] as UserItem
    }
     
  }
  public async updateUser(updtUser: UserItem) : Promise<ReturnService> {
    if(this.callCountUpdateUser === 0){
      this.callCountUpdateUser++;
      throw new Error('erro ao tentar atualizar um usuario');
    }
    return {
      status: true,
      message: 'Usuario atualizado'
    }
  }
  public async takeBook(pkUser: string,  pkBook: string) : Promise<ReturnService> {
    if(this.callCountTakeBook === 0){
      this.callCountTakeBook++;
      throw new Error('erro ao tentar pegar um livro');
    }
    return {
      status: true,
      message: 'Livro pego'
    }
  }
  public async returnBook(pkUser: string, pkBook: string) : Promise<ReturnService> {
    if(this.callCountReturnBook === 0){
      this.callCountReturnBook++;
      throw new Error('erro ao tentar retornar um livro');
    }
    return {
      status: true,
      message: 'Livro retornado'
    }
  }
}

const dynamoDBTable = new DBTable();
const bookService = new BookService(dynamoDBTable);
const userService = new UserService(dynamoDBTable, bookService);

const userBookController = new UserBookController(dynamoDBTable, userService)

describe('UserBookController', ()=>{
// 1 vez que chama o create do userService
  it('should return a error when i try to create a user', async () => {
    const req ={
      body: {
        "documento": "12345678910",
        "tipo": "PF",
        "nome": "Felipe",
        "dataDeInicioOuNascimento":"1985-06-17" ,
        "enderecos": ["rua jupiter 19"],
        "telefones": [12345678],
        "livroId": [],
        "tipoDeDados": "USUARIO"
      }
    } as Request
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar criar um usuario.';

    try{
      await userBookController.createUser(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
  it('should return a schema error', async()=>{
    const req ={
      body: {
        "documento": "111",
        "tipo": "PF",
        "nome": "Felipe",
        "dataDeInicioOuNascimento":"1985-06-17" ,
        "enderecos": ["rua jupiter 19"],
        "telefones": [12345678],
        "livroId": [],
        "tipoDeDados": "USUARIO"
      }
    } as Request
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      errors: [ { 
        message: "documento é um numero que tem que possuir 11 se for PF ou 14 se for PJ",
        path: 'documento' 
      } ]
    }
    await userBookController.createUser(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 2 vez que chama o create do userService
  it('should create a user', async () => {
    const req ={
      body: {
        "documento": "12345678910",
        "tipo": "PF",
        "nome": "Felipe",
        "dataDeInicioOuNascimento":"1985-06-17" ,
        "enderecos": ["rua jupiter 19"],
        "telefones": [12345678],
        "livroId": [],
        "tipoDeDados": "USUARIO"
      }
    } as Request;
    const expected ={ status: true, message: 'Usuario criado' }
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
  
    await userBookController.createUser(req, res);
    expect(statusValue).toBe(201);
    expect(jsonValue).toEqual(expected);
  });
  // // // 1 vez que chama o getById do user
  it('should throw an error when i try to return a user', async () => {
    const req ={ 
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar um usuario pelo id';

    try{
      await userBookController.getById(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // /// 2 vez que chama o getById do user
  it('should say Usuario nao achado', async() => {
    const req ={ 
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      status: true,
      error: 'Usuario nao achado'
    }
    await userBookController.getById(req, res);
    expect(statusValue).toBe(404);
    expect(jsonValue).toEqual(error);
  });
  // // 3 vez que chama o getById do user
  it('should return a user', async () => {
    const req ={ 
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204'
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    await userBookController.getById(req, res);
    expect(jsonValue).toEqual(mockWithUserStatus);
    expect(statusValue).toBe(200);
  });
  // // 1 vez que chama o get by document do user
  it('should throw an error when i try to return a user by document', async () => {
    const req ={ 
      params: {
        documento: '12345678910',
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar pegar um usuario pelo documento';

    try{
      await userBookController.getByDocument(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 2 vez que chama o getByDocument do userservice
  it('should say Usuario nao achado', async() => {
    const req ={ 
      params: {
        documento: '12345678910',
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      status: true,
      error: 'Usuario nao achado'
    }
    await userBookController.getByDocument(req, res);
    expect(statusValue).toBe(404);
    expect(jsonValue).toEqual(error);
  });
  // // 3 vez que chama o getByDocument do userservice
  it('should return a user', async () => {
    const req ={ 
      params: {
        documento: '12345678910',
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    await userBookController.getByDocument(req, res);
    expect(jsonValue).toEqual(mockWithUserStatus);
    expect(statusValue).toBe(200);
  });
  // // 1 vez que chama o updateUser do userservice
  it('should throw an error when i try to update a user', async () => {
    const req ={
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
        documento: '12345678910'
      },
      body: {
        "enderecos": ["rua jupiter 19"],
        "telefones": [12345678],
        "livroId": [],
        "tipoDeDados": "USUARIO"
      }
    } as unknown as Request
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar atualizar um usuario';

    try{
      await userBookController.updateUser(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 2 vez que chama o updateUser do userservice
  it('should return a schema error', async()=>{
    const req ={
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
        documento: '12345678910'
      },
      body: {
        "telefones": [12345678],
        "livroId": []
      }
    } as unknown as Request
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      errors: [ { 
        message: 'enderecos e obrigatorio',
        path: 'enderecos' 
      } ]
    }
    await userBookController.updateUser(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 3 vez que chama o updateUser do userservice
  it('should update a user', async () => {
    const req ={
      params: {
        id: 'ae5e855f-0fa1-4358-a425-8c6812cef204',
        documento: '12345678910'
      },
      body: {
        "enderecos": ["rua jupiter 19"],
        "telefones": [12345678],
        "livroId": []
      }
    } as unknown as Request;
    const expected ={ status: true, message: 'Usuario atualizado' }
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
  
    await userBookController.updateUser(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual(expected);
  });
  // // 1 vez que chama o takebook do userservice
  it('should throw an error when i try to take a book', async () => {
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
        "pkLivro": "a27243ce-6835-44f6-b6b4-353f8a7419f1"
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;
    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar pegar um livro';

    try{
      await userBookController.userBookGet(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 2 vez que chama o takebook do userservice
  it('should return a schema error', async()=>{
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      errors: [ { 
        message: 'pkLivro é obrigatorio',
        path: 'pkLivro' 
      } ]
    }
    await userBookController.userBookGet(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 3 vez que chama o takebook do userservice
  it('should take a book', async () => {
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
        "pkLivro": "a27243ce-6835-44f6-b6b4-353f8a7419f1"
      }
    } as unknown as Request;
    const expected ={ status: true, message: 'Livro pego' }
    let statusValue: number;
    let jsonValue: any;
    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
  
    await userBookController.userBookGet(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual(expected);
  });
  // // 1 vez que chama o returnbook do userservice
  it('should throw an error when i try to return a book', async () => {
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
        "pkLivro": "a27243ce-6835-44f6-b6b4-353f8a7419f1"
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;
    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = 'erro ao tentar retornar um livro';

    try{
      await userBookController.userBookReturn(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // // 2 vez que chama o returnbook do userservice
  it('should return a schema error', async()=>{
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
      }
    } as unknown as Request;
    let statusValue: number;
    let jsonValue: any;

    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
    const error = {
      errors: [ { 
        message: 'pkLivro é obrigatorio',
        path: 'pkLivro' 
      } ]
    }
    await userBookController.userBookReturn(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
  // //3 vez que chama o returnbook do userservice
  it('should return a book', async () => {
    const req ={
      body:{
        "pkUsuario": "ae5e855f-0fa1-4358-a425-8c6812cef204",
        "pkLivro": "a27243ce-6835-44f6-b6b4-353f8a7419f1"
      }
    } as unknown as Request;
    const expected ={ status: true, message: 'Livro retornado' }
    let statusValue: number;
    let jsonValue: any;
    const res = {
      status: function (code: number) {
        statusValue = code;
        return this;
      },
      json: function (data: any) {
        jsonValue = data;
        return this;
      }
    } as Response;
  
    await userBookController.userBookReturn(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual(expected);
  });
})