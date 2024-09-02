import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from 'src/02-services/interface/bookServiceInterface';
import {Book as BookInterface} from 'src/03-model/interface/bookType';
import {mockBookNoAvailable, mockNoUser, mockUpdateBook, mockUpdateBookWithStatusWithNoUserId, mockUpdateBookWithStatusWithUserId, mockWithUser, mockWithUserUpdateWithBookId, mockWithUserUpdateWithNoBookId, Users} from 'src/tests/unit/service/mocks/usersService';
import { ReturnService, ReturnServiceItem } from 'src/02-services/interface/userServiceInterface';
import {UserService} from  'src/02-services/user.service'
import {SqsHandler} from 'src/04-infrastructure/sqs'
import { BookItem } from 'src/04-infrastructure/items/book-item';
import { UserItem } from 'src/04-infrastructure/items/user-item';


class DBTable implements DynamoTableInterface {
  client: any;
  tableName: string;
  countUser = 0;
  countUpdateUser = 0;
  countquery = 0;
  putItem(item: any): Promise<boolean> {
    if(this.countUser === 0){
      this.countUser++;
      throw new Error('Erro ao criar usuario');
    }
    return Promise.resolve(true);
  }
  updateItem(params: any): Promise<boolean> {
    if(this.countUpdateUser === 0){
      this.countUpdateUser++;
      throw new Error('Erro ao criar usuario');
    }
    return Promise.resolve(true);
  }
  getItems(pk: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getItem(pk: string, sk: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  query(params: any): Promise<any> {
    if(this.countquery === 0){
      this.countquery++;
      throw new Error('Erro ao buscar usuario');
    }
    if(this.countquery === 1){
      this.countquery++;
      return Promise.resolve(mockNoUser);
    }
    if(this.countquery === 2){
      this.countquery++;
      return Promise.resolve(mockWithUser)
    }
    if(this.countquery === 3){
      this.countquery++;
      return Promise.resolve(mockNoUser)
    }
    if(this.countquery === 4){
      this.countquery++;
      throw new Error('Erro ao buscar usuario');

    }
    return Promise.resolve(mockWithUser);
  }
}

class BookService implements BookServiceInterface {
  tabela: DynamoTableInterface;
  countGetById = 0;
  public constructor(tabela: DynamoTableInterface){
    this.tabela = tabela;
  }
  public async createBook(book: BookInterface) : Promise<ReturnService> {
    throw new Error('Method not implemented.');
  }
  public async getById(pk: string) : Promise<ReturnServiceItem<BookItem>> {
    if(this.countGetById === 0){
      this.countGetById++;
      return await Promise.resolve(mockUpdateBookWithStatusWithNoUserId as ReturnServiceItem<BookItem> )
    }
    return await Promise.resolve(mockUpdateBookWithStatusWithUserId as ReturnServiceItem<BookItem>);
  }
  public async getByName(pk: string) : Promise<ReturnServiceItem<BookItem>> { 
    throw new Error('Method not implemented.'); 
  }
  public async updateBook(updtBook: BookItem) : Promise<ReturnService> {
    throw new Error('Method not implemented.'); 
  }
}

const DynamoDBTable = new DBTable();
const bookService = new BookService(DynamoDBTable);
const userService = new UserService(DynamoDBTable, bookService);

describe('User Service', () => {
  it('should return an error when creating a user', async () => {
    const result = await userService.createUser(Users[0]);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Erro ao criar usuario');
  })
  it('should create a user', async () => {
    const result = await userService.createUser(Users[0]);
    expect(result.status).toBe(true);
    expect(result.message).toBe('Usuario criado');
  })
  it('should get a user by id and return an error', async () => {
    const result = await userService.getById(Users[0].id);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Erro ao buscar usuario');
  });
  it('should get a user by id and did not find the user', async () => {
    const result = await userService.getById(Users[0].id);
    expect(result.status).toBe(true);
    expect(result.error).toBe('Usuario nao encontrado')
  })
  it('should get a user by id', async () => {
    const result = await userService.getById(Users[0].id);
    expect(result.status).toBe(true);
    expect(result.data.pk).toBe("##USER:ae5e855f-0fa1-4358-a425-8c6812cef204")
  })
  it('should get a user by document and return an error', async () => {
    const result = await userService.getByDocument(Users[0].documento);
    expect(result.status).toBe(true);
    expect(result.error).toBe("Usuario nao encontrado")
  })
  it('should get a user by document and return an error', async () => {
    const result = await userService.getByDocument(Users[0].documento);
    expect(result.status).toBe(false);
    expect(result.message).toBe('Erro ao buscar usuario');
  });

  it('should get a user by document', async () => {
    const result = await userService.getByDocument(Users[0].documento);
    expect(result.status).toBe(true);
    expect(result.data.pk).toBe("##USER:ae5e855f-0fa1-4358-a425-8c6812cef204")
  });
  it('should update a user and return an error', async () => {
    const result = await userService.updateUser(mockWithUserUpdateWithNoBookId as UserItem);
    expect(result.status).toBe(false);
    expect(result.message).toBe("Erro ao criar usuario")
  })
  it('should update a user', async () => {
    const result = await userService.updateUser(mockWithUserUpdateWithNoBookId as UserItem);
    expect(result.status).toBe(true);
    expect(result.message).toBe("Usuario atualizado")
  })
  it('should take a book', async () => {
    jest.spyOn(SqsHandler.prototype,'sendMessage').mockImplementation(async ()=>{
      return Promise.resolve({
        '$metadata': {
          httpStatusCode: 200,
          requestId: '284abf0d-a4a8-5a7e-b600-e01470b1de07',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        MD5OfMessageBody: '7fbbea575bbfef9664a18cbcc38e1f20',
        MessageId: 'f608a475-c31a-4264-966b-2f07ca43d67c',
        SequenceNumber: '18887512068045807616'
      })
    })
    const result = await userService.takeBook(mockWithUserUpdateWithNoBookId.data.id, mockUpdateBook.data.id);
    expect(result.status).toBe(true);
    expect(result.message).toBe("Livro pego")
  })
  it('should return a book', async () => {
    jest.spyOn(SqsHandler.prototype,'sendMessage').mockImplementation(async ()=>{
      return Promise.resolve({
        '$metadata': {
          httpStatusCode: 200,
          requestId: 'd6506e94-5b90-5cb9-a41c-318d8c8bddd2',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        MD5OfMessageBody: '80f63a7d78169b507c06a55da5b49121',
        MessageId: '968fdc3d-4959-486a-9e30-bae4bab36b84',
        SequenceNumber: '18887512265027311616'
      })
    })
    const result = await userService.returnBook(mockWithUserUpdateWithBookId.data.id, mockUpdateBookWithStatusWithUserId.data.data.id);
    expect(result.status).toBe(true);
    expect(result.message).toBe("Livro devolvido")
  })
  it('should say the book is not available', async () => {
    const result = await userService.takeBook(mockWithUserUpdateWithNoBookId.data.id, mockBookNoAvailable.data.data.id);
    expect(result.status).toBe(true);
    expect(result.error).toBe('Livro não disponivel');
  })
  it('should say the user does not have the book', async () => {
    const result = await userService.returnBook(mockWithUserUpdateWithNoBookId.data.id, mockUpdateBookWithStatusWithUserId.data.data.id);
    expect(result.error).toBe('Usuario nao alugou este livro.');
  })
})