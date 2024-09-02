import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import {Book as BookInterface} from 'src/03-model/interface/bookType';
import {BookItem} from 'src/04-infrastructure/items/book-item'
import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from './interface/bookServiceInterface';
import {ReturnService} from 'src/02-services/interface/userServiceInterface'
import {ReturnServiceItem} from 'src/02-services/interface/bookServiceInterface'
import { BookDefinition } from 'src/03-model/bookdefinition';
import {apiBookRequest} from 'src/02-services/utils/apiBook'
import { HttpClient } from 'src/03-model/axios-adapter';
export class BookService implements BookServiceInterface{
  tabela: DynamoTableInterface;
  httpClient: HttpClient;
  public constructor(tabela: DynamoTableInterface, httpClient: HttpClient){
    this.tabela = tabela;
    this.httpClient = httpClient;
  }
  async  createBook(book: BookInterface) : Promise<ReturnService> {
    try{
      const livroApi = await apiBookRequest(this.httpClient,book.nome)
      if(livroApi.error){
        return {
          status: livroApi.status,
          error: livroApi.error
        }
      }
      const autor = livroApi.data.docs[0].author_name[0];
      const bookComAutor = {
        ...book,
        autor: autor
      } 
      const livro = BookDefinition.manufacture(bookComAutor)
      const livroPersist = BookItem.From(livro);
      const livroProcurado = await this.getByName(livroPersist.data.nome);
      if(!livroProcurado.error){
        return {
          status: true,
          error: 'Livro já existe'
        }
      }
      await this.tabela.putItem(livroPersist);
      return {
        status: true,
        message: 'Livro criado'
      }
    } catch(error){
      return {
        status: false,
        message: error.message
      }
    }
  }
  async getById(id: string) : Promise<ReturnServiceItem<BookItem>> {
    try{
      const book = `##LIVRO:${id}`;
      const params: Partial<QueryCommandInput> = {
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": book
        }
      };
      const bookFound = await this.tabela.query(params);
      if(bookFound.Count > 0){
        return {
          status: true,
          data: bookFound.Items[0] as BookItem
        }
      }
      return {
        status: true,
        error: "Livro nao achado"
      };
    } catch(error){
      return {
        status: false,
        message: error.message
      }
    }
  };
  async updateBook (updtBook: BookItem) : Promise<ReturnService>{
    try{
      const updateParams: Partial<UpdateCommandInput> = {
        Key: {
          pk: updtBook.pk,
          sk: updtBook.sk
        },
        ExpressionAttributeNames: {
          '#data': 'data',
        },
        ExpressionAttributeValues: {
          ':data': updtBook.data,
        },
        UpdateExpression: 'set #data = :data',
        ConditionExpression: 'attribute_exists(pk)'
      }

      await this.tabela.updateItem(updateParams);
      return {
        status: true,
        message: 'Livro atualizado'
      }
    }catch(error){
      return {
        status: false,
        message: error.message
      };
    };
  };
  async getByName(nome: string): Promise<ReturnServiceItem<BookItem>> {
    try{
      const name = `##NOME:${nome}`;
      const params: Partial<QueryCommandInput> = {
        IndexName: 'GSI1',
        KeyConditionExpression: "sk = :sk",
        ExpressionAttributeValues: {
          ":sk": name 
        }
      };
      const bookFound = await this.tabela.query(params);
      if(bookFound.Count > 0){
        return {
          status: true,
          data: bookFound.Items[0] as BookItem
        }
      }
      return {
        status: true,
        error: "livro nao achado"
      };
    } catch(error){
      return  {
        status: false,
        message: error.message
      }
    }
  };
}