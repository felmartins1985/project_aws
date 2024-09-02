import { RegisterCognitoUser} from "src/01-presentation/controllers/schemas/cognitoNewUser"
import { UserMap } from "src/03-model/interface/usermap";
export interface BaseCognitoPool {
    userPoolId: string;
    cognitoClientId: string;
    registerUser(cognitoUser: RegisterCognitoUser): Promise<boolean>;
    findUserByEmail(email: string): Promise<UserMap>;
    authenticateUser(authParameters: {
      USERNAME: string;
      PASSWORD: string;
    }): Promise<string>;
}
  