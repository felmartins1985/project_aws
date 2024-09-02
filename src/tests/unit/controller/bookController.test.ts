import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from 'src/02-services/interface/bookServiceInterface';
import {Book as BookInterface} from 'src/03-model/interface/bookType';
import {Users} from 'src/tests/unit/service/mocks/usersService';
import {mockBookByID, mockBookWithStatus} from 'src/tests/unit/controller/mocks/allBooksController';
import {ReturnService, ReturnServiceItem} from 'src/02-services/interface/userServiceInterface'
import { Request, Response } from 'express';
import { BookItem } from 'src/04-infrastructure/items/book-item';
import { BookController } from 'src/01-presentation/controllers/bookController';
import { AxiosAdapter } from 'src/03-model/axios-adapter';


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
    throw new Error('Method not implemented.'); 
  }
}

class BookService implements BookServiceInterface {
  tabela: DynamoTableInterface;
  httpClient: AxiosAdapter;
  countBookCreate =0;
  countBookById = 0;
  countBookByName = 0;
  countBookUpdate = 0;
  public constructor(tabela: DynamoTableInterface, httpClient: AxiosAdapter){
    this.tabela = tabela;
    this.httpClient = httpClient;
  }
  public async createBook (book: BookInterface) : Promise<ReturnService>  {
    if(this.countBookCreate === 0){
      this.countBookCreate++;
      throw new Error('Erro ao tentar criar um usuario.');
    }
    return {
      status: true,
      message: 'Livro criado'
    }
  }
  public async getById (pk: string) : Promise<ReturnServiceItem<BookItem>> {
    if(this.countBookById === 0){
      this.countBookById++;
      throw new Error('erro ao tentar pegar um livro pelo id');  
    }
    if(this.countBookById === 1){
      this.countBookById++;
      return {
        status: true,
        error: 'Livro nao achado'
      }
    }
    return {
      status: true,
      data: mockBookByID as BookItem
    }
  }
  public async getByName(pk: string) : Promise<ReturnServiceItem<BookItem>> { 
    if(this.countBookByName === 0){
      this.countBookByName++;
      throw new Error('erro ao tentar pegar um livro pelo nome');  
    }
    if(this.countBookByName === 1){
      this.countBookByName++;
      return {
        status: true,
        error: 'Livro nao achado'
      }
    }
    return {
      status: true,
      data: mockBookByID as BookItem
    }
  }
  public async updateBook(updtBook: BookItem) : Promise<ReturnService> {
    if(this.countBookUpdate === 0){
      this.countBookUpdate++;
      throw new Error('erro ao tentar atualizar um livro');
    }
    return {
      status: true,
      message: 'Livro atualizado'
    }
  }
}


const httpClient = new AxiosAdapter();
const dynamoDBTable = new DBTable();
const bookService = new BookService(dynamoDBTable, httpClient);
const bookController = new BookController(dynamoDBTable, bookService);


describe('BookController', ()=>{
// 1 vez que chama o create do bookService
  it('should return a error when i try to create a book', async () => {
    const req ={
      body: {
        "nome": "GOT",
        "volumesDisponiveis": 1,
        "volumesAlugados": 0, 
        "usuarioId": [],
        "tipoDeDados": "LIVRO"
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
    const error = 'Erro ao tentar criar um usuario.';

    try{
      await bookController.createBook(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 400;
    }
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
//     // // 2 vez que chama o create do bookService
  it('should return a schema error', async()=>{
    const req ={
      body: {
        "volumesDisponiveis": 1,
        "volumesAlugados": 0, 
        "usuarioId": [],
        "tipoDeDados": "LIVRO"
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
        message: 'nome é obrigatorio',
        path: 'nome' 
      } ]
    }
    await bookController.createBook(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
//   // 3 vez que chama o create do bookService
  it('should create a book', async () => {
    const req ={
      body: {
        "nome": "GOT",
        "volumesDisponiveis": 1,
        "volumesAlugados": 0, 
        "usuarioId": [],
        "tipoDeDados": "LIVRO"
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
  
    await bookController.createBook(req, res);
    const resp = {
      status: true,
      message: 'Livro criado'
    }

    expect(statusValue).toBe(201);
    expect(jsonValue).toEqual(resp);
  })
//   // // // 1 vez que chama o getById do book
  it('should throw an error when i try to return a book using the id', async () => {
    const req ={ 
      params: {
        id: "a27243ce-6835-44f6-b6b4-353f8a7419f1"
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
    const error = 'erro ao tentar pegar um livro pelo id';

    try{
      await bookController.getById(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
//   // /// 2 vez que chama o getById do book
  it('should say  Livro nao achadoed using the id', async() => {
    const req ={ 
      params: {
        id: "a27243ce-6835-44f6-b6b4-353f8a7419f1"
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
      error: 'Livro nao achado'
    }
    await bookController.getById(req, res);
    expect(statusValue).toBe(404);
    expect(jsonValue).toEqual(error);
  })
//   // // 3 vez que chama o getById do book
  it('should return a book using the id', async () => {
    const req ={ 
      params: {
        id: "a27243ce-6835-44f6-b6b4-353f8a7419f1"
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
    await bookController.getById(req, res);
    expect(jsonValue).toEqual(mockBookWithStatus);
    expect(statusValue).toBe(200);
  });
//   // 1 vez que chama o getByName do book
  it('should throw an error when i try to return a book using the name', async () => {
    const req ={ 
      params: {
        nome: "Biblia"
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
    const error = 'erro ao tentar pegar um livro pelo nome';

    try{
      await bookController.getByName(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
//   // 2 vez que chama o getByName do book
  it('should say  book  not founded using the name', async() => {
    const req ={ 
      params: {
        nome: "Biblia"
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
      error: 'Livro nao achado'
    }
    await bookController.getByName(req, res);
    expect(statusValue).toBe(404);
    expect(jsonValue).toEqual(error);
  });
//    // // 3 vez que chama o getById do book
   it('should return a book using the name', async () => {
    const req ={ 
      params: {
        nome: "Biblia"
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
    await bookController.getByName(req, res);
    expect(jsonValue).toEqual(mockBookWithStatus);
    expect(statusValue).toBe(200);
  });
//   // // 1 vez que chama o updateBook do bookservice
  it('should throw an error when i try to update a book', async () => {
    const req ={
      params: {
        id: 'a27243ce-6835-44f6-b6b4-353f8a7419f1"',
        nome: 'Biblia'
      },
      body: {
        "volumesDisponiveis": 1,
        "volumesAlugados": 0,
        "usuarioId": []
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
    const error = 'erro ao tentar atualizar um livro';

    try{
      await bookController.updateBook(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
//   // 2 vez que chama o updateBook do bookservice
  it('should return a schema error', async()=>{
    const req ={
      params: {
        id: 'a27243ce-6835-44f6-b6b4-353f8a7419f1"',
        nome: 'Biblia'
      },
      body: {
        "volumesDisponiveis": -1,
        "volumesAlugados": 0,
        "usuarioId": []
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
        message: 'volumesDisponiveis tem que ter no minimo 0',
        path: 'volumesDisponiveis' 
      } ]
    }
    await bookController.updateBook(req, res);
    expect(statusValue).toBe(400);
    expect(jsonValue).toEqual(error);
  });
//   // // 3 vez que chama o updateBook do bookservice
  it('should update a book', async () => {
    const req ={
      params: {
        id: 'a27243ce-6835-44f6-b6b4-353f8a7419f1"',
        nome: 'Biblia'
      },
      body: {
        "volumesDisponiveis": 1,
        "volumesAlugados": 0,
        "usuarioId": ["12345"]
      }
    } as unknown as Request
    const expected ={ status: true, message: 'Livro atualizado' }
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
  
    await bookController.updateBook(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual(expected);
  });
})