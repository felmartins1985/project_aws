import {User as UserInterface} from 'src/03-model/interface/userType';
import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from './bookServiceInterface';
import { UserItem } from 'src/04-infrastructure/items/user-item';
export interface ReturnService {
  status: boolean;
  error?: any;
  message?: string;
}
export interface ReturnServiceItem<T> {
  status: boolean;
  error?: string; 
  data?: T;
  message?: string;
}
export interface UserServiceInterface {
  tabela: DynamoTableInterface;
  livro: BookServiceInterface;
  createUser(user: UserInterface): Promise<ReturnService>;
  getById(id: string): Promise<ReturnServiceItem<UserItem>>;
  updateUser(updtUser: UserItem): Promise<ReturnService>;
  getByDocument(documento: string): Promise<ReturnServiceItem<UserItem>>;
  takeBook(pkUsuario: string, pkLivro: string) : Promise<ReturnService>;
  returnBook(pkUsuario: string, pkLivro: string) : Promise<ReturnService>;
}

