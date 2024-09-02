import {Book as BookInterface} from 'src/03-model/interface/bookType';


import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookItem } from 'src/04-infrastructure/items/book-item';
import {ReturnService} from 'src/02-services/interface/userServiceInterface';
export interface ReturnServiceItem<T> {
  status: boolean;
  error?: string;
  data?: T;
  message?: string;
}
export interface BookServiceInterface {
  tabela: DynamoTableInterface;
  createBook(livro: BookInterface): Promise<ReturnService>;
  getById(id: string): Promise<ReturnServiceItem<BookItem>>;
  getByName(nome: string): Promise<ReturnServiceItem<BookItem>>;
  updateBook(updtLivro: BookItem): Promise<ReturnService>;
}