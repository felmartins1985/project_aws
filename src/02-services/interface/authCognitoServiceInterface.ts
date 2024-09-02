import { LoginUser } from "src/01-presentation/controllers/schemas/cognitoLogin";
import { RegisterCognitoUser } from "src/01-presentation/controllers/schemas/cognitoNewUser";
import { BaseCognitoPool } from "src/04-infrastructure/interface/cognitoPoolInterface";
import { HttpClient } from "src/03-model/axios-adapter";
import { UserCognitoServiceInterface } from "./userCognitoServiceInterface";

export type ReturnServiceCognito = {
  status: boolean;
  error?: string; 
  data?: any;
  message?: string;
}

export type ReturnServiceCognitoItem<T> = {
  status: boolean;
  error?: string; 
  data?: T;
  message?: string;
}

export type ReturnValidateToken = {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;  
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

export type ReturnexecuteValidationRoutine = {
  data: {
    status: boolean;
    data: {
      id: string;
      name: string
      email: string;
      role: Array<string>;
    },
    exp: number;
    auth_time: number;
  },
}

export interface AuthCognitoServiceInterface {
  cognitoUserPool: BaseCognitoPool;
  httpClient: HttpClient;
  cognitoUserService: UserCognitoServiceInterface;
  validateAccessToken(token: string): Promise<ReturnServiceCognito>;
  login(user:LoginUser): Promise<ReturnServiceCognito>;
  loginPassword(email: string, password: string): Promise<ReturnServiceCognito>;
  executeValidationRoutine(accessToken: string) : Promise<ReturnServiceCognito>;
}
