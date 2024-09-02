import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';

import {Book, mockNoBook, mockResponseBook, mockUpdateBook, mockWithBook} from 'src/tests/unit/service/mocks/booksService';
import { BookService } from 'src/02-services/book.service';
import { BookItem } from 'src/04-infrastructure/items/book-item';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { HttpClient } from 'src/03-model/axios-adapter';
import { mockResponse } from './mocks/cognitoService';


class DBTable implements DynamoTableInterface {
  client: any;
  tableName: string;
  countquery = 0;
  countCreate =0;
  putItem(item: any): Promise<boolean> {
    if(this.countCreate === 0){
      this.countCreate++;
      throw new Error('Erro ao criar livro');
    }
    return Promise.resolve(true);
  }
  updateItem(params: any): Promise<boolean> {
    return Promise.resolve(true);
  }
  getItems(pk: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getItem(pk: string, sk: string): Promise<any> {
    return Promise.resolve(Book[0])
  }
  query(params: any): Promise<any> {
    if(this.countquery === 0){
      this.countquery++;
      return Promise.resolve(mockNoBook);
    }
    if(this.countquery === 1){
      this.countquery++;  
      return Promise.resolve(mockNoBook);
    }
    if(this.countquery === 2){
      this.countquery++;  
      return Promise.resolve(mockWithBook);
    }
    if(this.countquery === 3){
      this.countquery++;
      throw new Error('Erro ao buscar livro');
    }
    if(this.countquery === 4){
      this.countquery++;
      return Promise.resolve(mockWithBook);
    }
    if(this.countquery === 5){
      this.countquery++;
      throw new Error('Erro ao buscar livro');
    }
    return Promise.resolve(mockWithBook);
  }
}

class RequestAdapter implements HttpClient {
  private mockGetResponse: AxiosResponse<any, any>;
  setMockGetResponse(response: AxiosResponse<any, any>): void {
    this.mockGetResponse = response;
  }
  get(url: string, headers: any): Promise<AxiosResponse<any, any>> {
    return Promise.resolve({
      ...this.mockGetResponse,
      headers,
      config:{
        headers
      }
    });
  }
}

const requestAdapter = new RequestAdapter();
const DynamoDBTable = new DBTable();
const bookService = new BookService(DynamoDBTable, requestAdapter);


describe('Book Service', () => {
  it('should return an error when trying to create a book', async () => {
    requestAdapter.setMockGetResponse(mockResponseBook);
    const result = await bookService.createBook(Book[0]);
    expect(result.status).toBe(false);
    expect(result.message).toBe("Erro ao criar livro");
  });
  it('should create a book', async () => {
    requestAdapter.setMockGetResponse(mockResponseBook);
    const result = await bookService.createBook(Book[1]);
    expect(result.message).toBe("Livro criado");
    expect(result.status).toBe(true)
  });
  it('should return a error message saying the book already exists', async () => {
    const result = await bookService.createBook(Book[0]);
    expect(result.error).toBe("Livro já existe");
    expect(result.status).toBe(true);
  });

  it('should return an error when trying to get a book by name', async () => {
    const result = await bookService.getByName(Book[0].nome);
    expect(result.status).toBe(false);
    expect(result.message).toBe("Erro ao buscar livro");
  });
  it('should get a book by name', async () => {
    const result = await bookService.getByName(Book[0].nome);
    expect(result.status).toBe(true);
    expect(result.data.pk).toBe('##BOOK:e6499a83-8c49-4efe-940e-c90201e78685')
  });
  it('should return an error when trying to get a book by id', async () => {
    const result = await bookService.getById(Book[0].id);
    expect(result.status).toBe(false);
    expect(result.message).toBe("Erro ao buscar livro");
  });
  it('should get a book by id', async ()=>{
    const result = await bookService.getById(Book[0].id);
    expect(result.status).toBe(true);
    expect(result.data.pk).toBe('##BOOK:e6499a83-8c49-4efe-940e-c90201e78685')
  });
  it('should update a book', async () => {
    const result = await bookService.updateBook(mockUpdateBook as BookItem);
    expect(result).toBeTruthy();
  });
})