import { UserCognitoController } from 'src/01-presentation/controllers/userCognitoController';
import { Request, Response } from 'express';
import { BaseCognitoPool } from 'src/04-infrastructure/interface/cognitoPoolInterface';
import { RegisterCognitoUser } from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import {UserCognitoServiceInterface} from 'src/02-services/interface/userCognitoServiceInterface'
import { ReturnServiceCognito } from 'src/02-services/interface/authCognitoServiceInterface';
class CognitoPool implements BaseCognitoPool{
  constructor(readonly userPoolId: string, readonly cognitoClientId: string) { }
  async registerUser (user: RegisterCognitoUser): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findUserByEmail(email: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  authenticateUser(authParameters: { USERNAME: string; PASSWORD: string; }): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
class UserCognitoService implements UserCognitoServiceInterface{
  cognitoUserPool: BaseCognitoPool;
  countCreate = 0;
  constructor(cognitoUserPool: BaseCognitoPool) {
    this.cognitoUserPool = cognitoUserPool;
  }
  public createUser(user: RegisterCognitoUser): Promise<ReturnServiceCognito>{
    if(this.countCreate === 0){
      this.countCreate++;
      throw new Error('Erro ao tentar criar um usuario.');
    }
    if(this.countCreate === 1){
      this.countCreate++;
      return Promise.resolve({
        status: true,
        message: 'Usuario ja existe',
      });
    };
    return Promise.resolve({
      status: true,
      message: 'usuario criado'
    });
  }
  public getByEmail(email: string): Promise<ReturnServiceCognito>{
    throw new Error('Method not implemented.');
  }
}


const cognitoPool = new CognitoPool('userPoolId', 'cognitoClientId');
const userCognitoService = new UserCognitoService(cognitoPool);
const userCognitoController = new UserCognitoController(userCognitoService);

describe(' User Cognito Controller', () =>{
  it('should return a schema error when creating a user', async () => {
  const req ={
    body:{
        "nome": "Fe",
        "email": "felipe@email.com",
        "role":[{
          "role": "admin",
          "org": "bigtrade"
        }],
        "password": "111111"
    }
  } as Request;
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
      message: "Nome tem que ter pelo menos 3 caracteres",
      path: 'nome' 
    } ]
  };
  await userCognitoController.createUser(req, res);
  expect(statusValue).toBe(400);
  expect(jsonValue).toEqual(error);
});
it('should return an error when creating a user', async () => {
  const req ={
    body:{
        "nome": "Felipe",
        "email": "felipe@email.com",
        "role":[{
          "role": "admin",
          "org": "bigtrade"
        }],
        "password": "111111"
    }
  } as Request;
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
  const error ='Erro ao tentar criar um usuario.';
  try{
    await userCognitoController.createUser(req, res);
  }  catch (err) {
    jsonValue = err;
    statusValue = 500;
  }
  expect(statusValue).toBe(500);
  expect(jsonValue).toEqual(error);
});
it('should return that user already exists', async () => {
  const req ={
    body:{
        "nome": "Felipe",
        "email": "felipe@email.com",
        "role":[{
          "role": "admin",
          "org": "bigtrade"
        }],
        "password": "111111"
    }
  } as Request;
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

  await userCognitoController.createUser(req, res);

  expect(statusValue).toBe(201);
  expect(jsonValue).toEqual({
    status: true,
    message: 'Usuario ja existe'
  });
})
it('should create an user', async () => {
  const req ={
    body:{
        "nome": "Felipe",
        "email": "felipe@email.com",
        "role":[{
          "role": "admin",
          "org": "bigtrade"
        }],
        "password": "111111"
    }
  } as Request;
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

  await userCognitoController.createUser(req, res);

  expect(statusValue).toBe(201);
  expect(jsonValue).toEqual({
    status: true,
    message: 'usuario criado'
  });
});
});

