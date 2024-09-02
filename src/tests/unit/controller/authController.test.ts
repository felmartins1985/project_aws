import { AxiosAdapter } from 'src/03-model/axios-adapter';
import { AuthCognitoServiceInterface, ReturnServiceCognito } from 'src/02-services/interface/authCognitoServiceInterface';
import { AuthCognitoController } from 'src/01-presentation/controllers/authCognitoController';
import { Request, Response } from 'express';
import { BaseCognitoPool } from 'src/04-infrastructure/interface/cognitoPoolInterface';
import { RegisterCognitoUser } from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import { LoginUser } from 'src/01-presentation/controllers/schemas/cognitoLogin';
import { mockToken, mockValidate } from './mocks/cognitoMocks';
import {UserCognitoServiceInterface} from 'src/02-services/interface/userCognitoServiceInterface'
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
  constructor(cognitoUserPool: BaseCognitoPool) {
    this.cognitoUserPool = cognitoUserPool;
  }
  public createUser(user: RegisterCognitoUser): Promise<ReturnServiceCognito>{
    throw new Error('Method not implemented.');
  }
  public getByEmail(email: string): Promise<ReturnServiceCognito>{
    throw new Error('Method not implemented.');
  }
}
class AuthService implements AuthCognitoServiceInterface {
  cognitoUserPool: BaseCognitoPool;
  httpClient: AxiosAdapter;
  cognitoUserService: UserCognitoServiceInterface;
  countUserCreate =0;
  countUserLogin =0;
  countValidateToken =0;
  constructor(cognitoUserPool: BaseCognitoPool, httpClient: AxiosAdapter, cognitoUserService: UserCognitoServiceInterface) {
    this.cognitoUserPool = cognitoUserPool;
    this.httpClient = httpClient;
    this.cognitoUserService = cognitoUserService;
  }
  public validateAccessToken(token: string): Promise<ReturnServiceCognito> {
    throw new Error('Method not implemented.');
  }
  public login(user: LoginUser ): Promise<ReturnServiceCognito>{
    if(this.countUserLogin === 0){
      this.countUserLogin++;
      throw new Error('Erro ao tentar logar.');
    }
    return Promise.resolve({
      status: true,
      data: mockToken
    });
  }
  public loginPassword(email: string, password: string): Promise<ReturnServiceCognito>{
    throw new Error('Method not implemented.');
  }
  public executeValidationRoutine(accessToken: string) : Promise<ReturnServiceCognito>{
    if(this.countValidateToken === 0){
      this.countValidateToken++;
      throw new Error('Erro ao tentar validar o token.');
    }
    return Promise.resolve({status: true, data: mockValidate});
  }
  public async fetchJwks(){
    throw new Error('Method not implemented.');
  }
}
const httpClient = new AxiosAdapter();
const cognitoPool = new CognitoPool('userPoolId', 'cognitoClientId');
const userCognitoService = new UserCognitoService(cognitoPool);
const authService = new AuthService(cognitoPool, httpClient,userCognitoService);
const authController = new AuthCognitoController(authService);

describe(' Controller', () =>{
  it('should return an error when login', async () => {
    const req ={
      body:{
          "login": "felipe@email.com",
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
    const error ='Erro ao tentar logar.';
    try{
      await authController.login(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
  it('should return a schema error when login', async () => {
    const req ={
      body:{
          "login": "felipe@email.com",
          "password": "11111"
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
        message: "Senha tem que ter pelo menos 6 caracteres",
        path: 'password' 
      } ]
    };
    await authController.login(req, res);
    expect(statusValue).toBe(400);
  });
  it('should login', async () =>{
    const req ={
      body:{
          "login": "felipe@email.com",
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
   
    await authController.login(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual({status: true, data: mockToken})
  });
  it('should return an error when validating a token', async () => {
    const req = {
      headers:{
        authorization: mockToken
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
    const error ='Erro ao tentar validar o token.';
    try{
      await authController.validateToken(req, res);
    }  catch (err) {
      jsonValue = err;
      statusValue = 500;
    }
    expect(statusValue).toBe(500);
    expect(jsonValue).toEqual(error);
  });
  it('should validate a token', async () =>{
    const req = {
      headers:{
        authorization: mockToken
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
    await authController.validateToken(req, res);
    expect(statusValue).toBe(200);
    expect(jsonValue).toEqual({status: true, data: mockValidate})
  });
  it('should not pass a token in the headers', async()=>{
    const req = {
      headers:{
       
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
    await authController.validateToken(req, res);
    expect(statusValue).toBe(401);
    expect(jsonValue).toEqual({status: true, message: 'Token nao achado'})
  })
});