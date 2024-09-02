import { RegisterCognitoUser} from "src/01-presentation/controllers/schemas/cognitoNewUser"
import { BaseCognitoPool } from "src/04-infrastructure/interface/cognitoPoolInterface"
import { ReturnServiceCognito, ReturnServiceCognitoItem } from "./interface/authCognitoServiceInterface";
import { UserMap } from "src/03-model/interface/usermap";
import { UserCognitoServiceInterface } from "./interface/userCognitoServiceInterface";

export class UserCognitoService implements UserCognitoServiceInterface{
  cognitoUserPool: BaseCognitoPool;
  constructor(cognitoUserPool: BaseCognitoPool) {
    this.cognitoUserPool = cognitoUserPool; 
  }
    // cria um usuario no cognito
  public async createUser(user: RegisterCognitoUser):Promise<ReturnServiceCognito> {
      try{
        const procurarUsuario = await this.getByEmail(user.email);
        if(procurarUsuario.data){
          return {
            status: true,
            error: 'Usuario ja existe',
          };
        }
        await this.cognitoUserPool.registerUser(user)      
        return {
          status: true,
          message: 'usuario criado'
        };
      } catch(error){
        return {
          status: false,
          message: error.message
        };
      }
  };

  // busca um usuario pelo email

public async getByEmail(email: string): Promise<ReturnServiceCognitoItem<UserMap>> {
  try {
    const user = await this.cognitoUserPool.findUserByEmail(email);

    if (!Object.keys(user).length) {
      return {
        status: true,
        error: 'Usuario nao encontrado',
      };
    }
    return {
      status: true,
      data: user,
    };
  } catch (error) {
    return {
      status: false,
      error: error.message,
    };
  }
};
}