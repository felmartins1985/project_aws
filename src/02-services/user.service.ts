import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import {User as UserInterface} from 'src/03-model/interface/userType';
import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { UserServiceInterface } from './interface/userServiceInterface';
import { BookServiceInterface } from './interface/bookServiceInterface';
import {SqsHandler} from 'src/04-infrastructure/sqs'
import { UserItem } from 'src/04-infrastructure/items/user-item';
import { BookItem } from 'src/04-infrastructure/items/book-item';
import { ReturnService, ReturnServiceItem } from './interface/userServiceInterface';
import { UserDefinition } from 'src/03-model/userdefinition';
import { BookDefinition } from 'src/03-model/bookdefinition';

export class UserService implements UserServiceInterface{
  tabela: DynamoTableInterface;
  livro: BookServiceInterface;
  public constructor(table: DynamoTableInterface, book: BookServiceInterface){
    this.tabela = table;
    this.livro = book;
  }
  async  createUser(user: UserInterface) : Promise<ReturnService>{
    try{
      const usuario = UserDefinition.manufacture(user);
      const usarioPersist = UserItem.From(usuario)
      await this.tabela.putItem(usarioPersist);
      return {
        status: true,
        message: 'Usuario criado'
      }
    } catch(e){
      return {
        status: false,
        message: e.message
      }
    };
  }
  async getById(id: string) : Promise<ReturnServiceItem<UserItem>> {
    try{ 
      const user = `##USUARIO:${id}`;
      const params: Partial<QueryCommandInput> = {
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": user
        }
      };
      const userFound = await this.tabela.query(params);
      if(userFound.Count > 0){
        return {
          status: true,
          data: userFound.Items[0] as UserItem
        }
      }
      return {
        status: true,
        error: 'Usuario nao encontrado'
      }
      } catch(error){
        return {
          status: false,
          message: error.message
        }
      }
  };
  async getByDocument(documento: string): Promise<ReturnServiceItem<UserItem>>{
    try{
      const doc = `##DOCUMENTO:${documento}`;
      const params: Partial<QueryCommandInput> = {
        IndexName: 'GSI1',
        KeyConditionExpression: "sk = :sk",
        ExpressionAttributeValues: {
          ":sk": doc 
        }
      };
      const userFound = await this.tabela.query(params);
      if(userFound.Count > 0){
        return {
          status: true,
          data: userFound.Items[0] as UserItem
        }
      }
      return {
        status: true,
        error: 'Usuario nao encontrado'
      }
    } catch(error){
      return {
        status: false,
        message: error.message
      }
    }
  };
  async updateUser(updtUser: UserItem) : Promise<ReturnService>{
    try{
      const updateParams: Partial<UpdateCommandInput> = {
        Key: {
          pk: updtUser.pk,
          sk: updtUser.sk
        },
        ExpressionAttributeNames: {
          '#data': 'data',
        },
        ExpressionAttributeValues: {
          ':data': updtUser.data,
        },
        UpdateExpression: 'set #data = :data',
        ConditionExpression: 'attribute_exists(pk)'
      }
      await this.tabela.updateItem(updateParams);
      return {
        status: true,
        message: 'Usuario atualizado'
      }}
    catch(error){
      return {
        status: false,
        message: error.message
      }
    }
  };
  async takeBook(pkUser: string, pkBook: string) : Promise<ReturnService> {
    const usuario = await this.getById(pkUser);
    if(usuario.error){
      return {
        status: usuario.status,
        error: usuario.error
      }
    }
    const livro = await this.livro.getById(pkBook);
    if(livro.error){
      return {
        status: livro.status,
        error: livro.error
      }
    }
    const validarRegras = this.businessRulesGET(usuario.data, livro.data, pkBook);
    if(validarRegras.error){
      return validarRegras;
    }
    try{
      await this.updateUserBookGet(usuario.data, livro.data)
      return {
        status: true,
        message: 'Livro pego'
      };
    } catch(error){
      console.log("Erro ao tentar alugar o livro=======>", error);
      return {
        status: false,
        message: error.message
      }
    }
  };
  async returnBook(pkUser: string,pkBook: string) : Promise<ReturnService> {
    const usuario = await this.getById(pkUser);
    if(usuario.error){
      return {
        status: usuario.status,
        error: usuario.error
      }
    }
    const livro = await this.livro.getById(pkBook);
    if(livro.error){
      return {
        status: livro.status,
        error: livro.error
      }
    }
    const validarRegras = this.businessRulesRETURN(usuario.data, pkUser, livro.data, pkBook);
    if(validarRegras.error){
      return validarRegras;
    } 
    try{
      await this.updateUserBookReturn(usuario.data, livro.data);
      return {
        status: true,
        message: 'Livro devolvido'
      }
    } catch(error){
      console.log("Erro ao tentar devolver o livro=======>", error);
      return {
        status: false,
        message: error.message
      }
    }
  };
  public businessRulesGET(user: UserItem, book: BookItem, pkBook: string){
    if(user.data.livroId.includes(pkBook)){
      return {
        status: true,
        error: 'Livro já foi pego pelo usuario'
      }
    };
    if(book.data.volumesDisponiveis === 0){
      return {
        status: true,
        error: 'Livro não disponivel'
      }
    }
    return {
        status: true,
        message: 'Livro Disponivel'
    };
  };
  
  public businessRulesRETURN(user: UserItem, pkUser: string, book: BookItem, pkBook: string): ReturnService {
    if(!user.data.livroId.includes(pkBook)){
      return {
        status: true,
        error: 'Usuario nao alugou este livro.'
      }
    };
    if(!book.data.usuarioId.includes(pkUser)){
      return {
        status: true,
        error: 'O livro nao foi alugado por este usuario'
      }
    };
    return {
      status: true,
      message: 'Livro pode ser devolvido'
    };
  }
  async updateUserBookGet(user: UserItem, book: BookItem): Promise<ReturnService>{
    try{
      const usuario = UserDefinition.manufacture(user.data);
      const livro = BookDefinition.manufacture(book.data);
      usuario.addLivro(livro);
      livro.addUsuario(usuario);
      const usuarioAtualizado = UserItem.From(usuario);
      const livroAtualizado = BookItem.From(livro)
      const sqs = new SqsHandler(process.env.SQS_QUEUE_URL);
      await sqs.sendMessage({
        MessageGroupId:"USUARIO",
        MessageBody: JSON.stringify(usuarioAtualizado),
        MessageDeduplicationId: `USER#${Date.now()}`
      });
      await sqs.sendMessage({
        MessageGroupId: "LIVRO",
        MessageBody: JSON.stringify(livroAtualizado),
        MessageDeduplicationId: `BOOK#${Date.now()}`
      });
      return {
        status: true,
        message: 'livro alugado'
      };
    }
    catch(error){
      console.log("ERRO no envio de mensagem para a fila dentro da funcao secundaria de pegar====>", error);
      return {
        status: false,
        message: error.message
      }
    };
  };
  async updateUserBookReturn(user: UserItem, book: BookItem): Promise<ReturnService>{
    try{
      const usuario = UserDefinition.manufacture(user.data);
      const livro = BookDefinition.manufacture(book.data);
      usuario.removeLivro(livro);
      livro.removeUsuario(usuario);
      const usuarioAtualizado = UserItem.From(usuario);
      const livroAtualizado = BookItem.From(livro)
      const sqs = new SqsHandler(process.env.SQS_QUEUE_URL);   
      await sqs.sendMessage({
        MessageGroupId:"USUARIO", 
        MessageBody: JSON.stringify(usuarioAtualizado),
        MessageDeduplicationId: `USER#${Date.now()}`
      });
      await sqs.sendMessage({
        MessageGroupId: "LIVRO",
        MessageBody: JSON.stringify(livroAtualizado),
        MessageDeduplicationId: `BOOK#${Date.now()}`
      });
      return {
        status: true,
        message: 'Livro retornado'
      };
    }
    catch(error){
      return {
        status: false,
        message: error.message
      }
    };
  };
};
