import { RegisterCognitoUser } from "src/01-presentation/controllers/schemas/cognitoNewUser";
import { BaseCognitoPool } from "src/04-infrastructure/interface/cognitoPoolInterface";
import { ReturnServiceCognito } from "./authCognitoServiceInterface";

export interface UserCognitoServiceInterface {
  cognitoUserPool: BaseCognitoPool;
  createUser(user: RegisterCognitoUser): Promise<ReturnServiceCognito>;
  getByEmail(email: string): Promise<ReturnServiceCognito>;
}