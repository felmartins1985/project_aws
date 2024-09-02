import { RegisterCognitoUser } from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import { BaseCognitoPool } from 'src/04-infrastructure/interface/cognitoPoolInterface';
import { UserCognitoService } from 'src/02-services/userCognito.service';
import { mockUserEmail } from './mocks/cognitoService';


class CognitoPool implements BaseCognitoPool{
  countRegister = 0;
  countEmail = 0;
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
    if(this.countEmail === 0){
      this.countEmail++;
      throw new Error('Erro vindo do cognito');
    }
    if(this.countEmail === 1){
      this.countEmail++;
      return Promise.resolve(mockUserEmail);
    }
    if(this.countEmail === 2){
      this.countEmail++;
      return Promise.resolve({});
    }
    if(this.countEmail === 3){ // should return an error - getbyemail
      this.countEmail++;
      throw new Error('Erro vindo do cognito');
    }
    if(this.countEmail === 4){
      this.countEmail++;
      return Promise.resolve({});
    }
    if(this.countEmail === 5){
      this.countEmail++;
      return Promise.resolve(mockUserEmail);
    }
    if(this.countEmail === 6){
      this.countEmail++;
      return Promise.resolve({});
    }
    if(this.countEmail === 7){
      this.countEmail++;
      return Promise.resolve({});
    }
    if(this.countEmail === 8){
      this.countEmail++;

      return Promise.resolve(mockUserEmail);
    }
    if(this.countEmail === 9){
      this.countEmail++;
      return Promise.resolve({});
    }
    return Promise.resolve(mockUserEmail);
  }
  authenticateUser(authParameters: { USERNAME: string; PASSWORD: string; }): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

const cognitoUserPool = new CognitoPool('userPoolId','userPoolClientId');
const userCognitoService = new UserCognitoService(cognitoUserPool);


describe('User Cognito Service', () => {
  it('should occur an error', async () =>{
    const user = {
      "nome": "Joao",
      "email": "joao@email.com",
      "role":[{
        "role": "admin",
        "org": "bigtrade"
      }],
      "password": "111111"
    }
    const response = await userCognitoService.createUser(user);
    expect(response.status).toBe(false);
    expect(response.message).toBe('Erro vindo do cognito');
  });
  it('should not create a user', async () =>{
    const user = {
      "nome": "Joao",
      "email": "joao@email.com",
      "role":[{
        "role": "admin",
        "org": "bigtrade"
      }],
      "password": "111111"
    }
    const response = await userCognitoService.createUser(user);
    expect(response.status).toBe(true);
    expect(response.error).toBe('Usuario ja existe');
  });
  it('should create a user', async () =>{
    const user = {
      "nome": "Joao",
      "email": "joao@email.com",
      "role":[{
        "role": "admin",
        "org": "bigtrade"
      }],
      "password": "111111"
    }
    const response = await userCognitoService.createUser(user);
    expect(response.status).toBe(true);
    expect(response.message).toBe('usuario criado');
  });
  it('should return an error - getbyemail', async ()=>{
    const email = "joao@email.com";
    const response = await userCognitoService.getByEmail(email);
    expect(response.status).toBe(false);
    expect(response.error).toBe('Erro vindo do cognito');
  });
  it('should return not found an user -getbyemail', async ()=>{
    const email = "joao@email.com";
    const response = await userCognitoService.getByEmail(email);
    expect(response).toEqual({
      "error": "Usuario nao encontrado",
      "status": true,
    });
  });
 it('should return an user -getbyemail', async ()=>{
  const email = "joao@email.com";
  const response = await userCognitoService.getByEmail(email);
  expect(response.status).toBe(true);
  expect(response.data).toEqual(mockUserEmail);
  }); 
});