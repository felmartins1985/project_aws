import { RegisterCognitoUser } from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import { BaseCognitoPool } from 'src/04-infrastructure/interface/cognitoPoolInterface';
import { AuthCognitoService } from 'src/02-services/authCognito.service';
import {UserCognitoServiceInterface} from 'src/02-services/interface/userCognitoServiceInterface'
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { HttpClient } from 'src/03-model/axios-adapter';
import { mockInvalidToken, mockResponse, mockResponseExecuteValidationRoutine, mockResponseValidateToken, mockUserEmail } from './mocks/cognitoService';


/////SEMPRE TEM QUE ATUALIZAR O TOKEN VALIDO - 8 horas/////////
const mockValidToken = "eyJraWQiOiJYTnl4eUVObEsrSlZrbkZCK2w1UENFd2Y0NEUwQ0VweWp6T05IOVRlT1JnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NGE4NjQ2OC01MGQxLTcwOTAtN2JhNi04YjRiOGZlNzcwYzYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QcmFlQ1BFT20iLCJjbGllbnRfaWQiOiIxdnFodTcyYm9nbGRsZ3NzN3NoczZvb3VkcCIsIm9yaWdpbl9qdGkiOiI1NDMyMGY1OC0yOTg5LTRmZjQtOTJlOC01MTFjODIyNWQzOGIiLCJldmVudF9pZCI6IjdmMjFlYjY2LWZkZjctNGZmZi1hODk2LTNiMTBmNDNmZjlmMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjQwNjQ3OTksImV4cCI6MTcyNDA5MzU5OSwiaWF0IjoxNzI0MDY0Nzk5LCJqdGkiOiIyMTNmNTBmNC05Mzc1LTQxMzgtOWI2Yy0wMDMzNGFhYWNiYTAiLCJ1c2VybmFtZSI6ImZlbHBzQGVtYWlsLmNvbSJ9.IQGcnv9HXDJgHAZkYEMXDO2jl1DtaU-fKJEY3j2fSWHVPscFDOBLxLMwSj5ns51QafMjW4ZWd9mYj2ISuvDJ7FY3RSxO2gAjNzT907Qjs7Qii4BIWl7DBsqAUrWsvBlRgGdc3FCiG8UYNKPFSngsezP2vt-vt3HtHfG_4_g1oP1I0-c69mZvB4OoMBoSEOg0CVq25oOYXXrtA9t8C6FMazdQq4Gw7Iy5qMlNnUx8CCfYhFcHgTYGRASw3rKNjt1JwfY3FHH0HphoUUByxZpjYRopYqW48Zg0AFzIjNKnL-9h04ucf6ew-SSvzNBqp9VUH8lV9unJOsujqSDR4sHo7w"


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

class CognitoPool implements BaseCognitoPool{
  countRegister = 0;
  countAuthenticate = 0;
  constructor(readonly userPoolId: string, readonly cognitoClientId: string) { }
  async registerUser (user: RegisterCognitoUser): Promise<any> {
    if(this.countRegister === 0){
      this.countRegister++;
      throw new Error('Erro vindo do cognito');
    }
    if(this.countRegister === 1){
      this.countRegister++;
      return Promise.resolve(true);
    }
    return Promise.resolve(true);
  }
  findUserByEmail(email: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  authenticateUser(authParameters: { USERNAME: string; PASSWORD: string; }): Promise<any> {
    
    if(this.countAuthenticate === 0){ //should login
      this.countAuthenticate++;
      throw new Error('Erro desconhecido ao tentar fazer login');
    }
    if(this.countAuthenticate === 1){
      this.countAuthenticate++;
      return Promise.resolve(mockValidToken);
    }
    if(this.countAuthenticate === 2){
      this.countAuthenticate++;
      throw new Error('Erro desconhecido ao tentar fazer login');
    }
    if(this.countAuthenticate === 3){
      this.countAuthenticate++;
      return Promise.resolve(mockValidToken);
    }
    return Promise.resolve({mockValidToken});
  }
}

class userCognito implements UserCognitoServiceInterface {
  cognitoUserPool: BaseCognitoPool;
  countGetEmail= 0;
  constructor(cognitoUserPool: BaseCognitoPool) {
    this.cognitoUserPool = cognitoUserPool;
  }
  public async createUser(user: RegisterCognitoUser): Promise<any> {
    throw new Error('Method not implemented- create.');
  }
  public async getByEmail(email: string): Promise<any> {
    if(this.countGetEmail === 0){
      this.countGetEmail++;
      throw new Error('Metodo nao implementado- getby');
    }
    if(this.countGetEmail === 1){
      this.countGetEmail++;
      return Promise.resolve({
        status: true,
        error: 'Usuario nao encontrado'
      });
    }
    if(this.countGetEmail === 2){
      this.countGetEmail++;
      return Promise.resolve(
        {
          status: true,
          data: {
            id: '1468a478-80c1-70ad-aad1-310927eab406',
            name: 'Joao',
            email: 'joao@email.com',
            role: '[{"role":"admin","org":"bigtrade"}]'
          }
        }
      );
    }
    if(this.countGetEmail === 3){ //should login
      this.countGetEmail++;
      return Promise.resolve(
        {
          status: true,
          data: {
            id: '1468a478-80c1-70ad-aad1-310927eab406',
            name: 'Joao',
            email: 'joao@email.com',
            role: '[{"role":"admin","org":"bigtrade"}]'
          }
        }
      );
    };
    if(this.countGetEmail === 4){ //should login
      this.countGetEmail++;
      return Promise.resolve(
        {
          status: true,
          data: {
            id: '1468a478-80c1-70ad-aad1-310927eab406',
            name: 'Joao',
            email: 'joao@email.com',
            role: '[{"role":"admin","org":"bigtrade"}]'
          }
        }
      );
    };
    if(this.countGetEmail === 5){ //should login
      this.countGetEmail++;
      return Promise.resolve(
        {
          status: true,
          data: {
            id: '1468a478-80c1-70ad-aad1-310927eab406',
            name: 'Joao',
            email: 'joao@email.com',
            role: '[{"role":"admin","org":"bigtrade"}]'
          }
        }
      );
    };
    return Promise.resolve({
      status: true,
      error: 'Usuario  encontrado'
    });
  }
}

const requestAdapter = new RequestAdapter();
const cognitoUserPool = new CognitoPool('userPoolId','userPoolClientId');
const userCognitoService = new userCognito(cognitoUserPool);
const authService = new AuthCognitoService(cognitoUserPool, requestAdapter,userCognitoService);

describe('Auth Service', () => {
  it('should thrown an error', async ()=>{
    const user = { 
      "login": "joao",
      "password": "111111"
    }
    const response = await authService.login(user);
    expect(response.status).toBe(false);
    expect(response.error).toBe('Metodo nao implementado- getby');
  })
  it('shoud not found a user when i try to login usingGetByEmail', async()=>{
    const user = { 
      "login": "joao",
      "password": "111111"
    }
    const response = await authService.login(user);
    expect(response.status).toBe(true);
    expect(response.error).toBe('Usuario nao encontrado');
  });
  it('shoud not found a user when i try to login - loginPassword', async()=>{
    const user = { 
      "login": "joao@email.com",
      "password": "111111"
    }
    const response = await authService.login(user);
    expect(response.status).toBe(false);
    expect(response.error).toBe("Erro desconhecido ao tentar fazer login");
  });
  it('should login', async()=>{
    const user = { 
      "login": "joao",
      "password": "111111"
    }
    const response = await authService.login(user);
    expect(response).toEqual({
      "status": true,
      "data": mockValidToken
    });
  });
  it('should throw an error with the jwt expired - validateAccessToken', async()=>{
    requestAdapter.setMockGetResponse(mockResponse);
    const response = await authService.validateAccessToken(mockInvalidToken);
    expect(response.status).toBe(false);
    expect(response.error).toBe('jwt expired');
  })
  it('should return a status true and the datas - validateAccessToken', async()=>{
    requestAdapter.setMockGetResponse(mockResponse);
    const response = await authService.validateAccessToken(mockValidToken);
    expect(response.status).toBe(true);
    expect(response.data.username).toBe('felps@email.com');
  });
  it('should throw an error - loginPassword', async()=>{
    const response = await authService.loginPassword('joao','111111');
    expect(response.status).toBe(false);
    expect(response.error).toBe('Erro desconhecido ao tentar fazer login');
  });
  it('should works - loginPassword', async()=>{
    const response = await authService.loginPassword('joao','111111');
    expect(response.status).toBe(true); 
    expect(response.data).toBe(mockValidToken);
  });
  it('should works - executeValidationRoutine', async()=>{
    const response = await authService.executeValidationRoutine(mockValidToken);
    // sempre atualizar o auth_time e exp
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockResponseExecuteValidationRoutine);
  });
});
 