import { LoginUser } from "src/01-presentation/controllers/schemas/cognitoLogin";
import { decode, JwtPayload, verify } from "jsonwebtoken";
import jwkToPem from 'jwk-to-pem';
import { AuthCognitoServiceInterface, ReturnexecuteValidationRoutine, ReturnServiceCognito, ReturnServiceCognitoItem, ReturnValidateToken } from "./interface/authCognitoServiceInterface";
import { BaseCognitoPool } from "src/04-infrastructure/interface/cognitoPoolInterface";
import { HttpClient } from 'src/03-model/axios-adapter';
import { UserCognitoServiceInterface } from "./interface/userCognitoServiceInterface";

export class AuthCognitoService implements AuthCognitoServiceInterface {
  cognitoUserService: UserCognitoServiceInterface;
  cognitoUserPool: BaseCognitoPool;
  httpClient: HttpClient;
	constructor(cognitoUserPool: BaseCognitoPool, httpClient: HttpClient, userCognito: UserCognitoServiceInterface) {
    this.cognitoUserPool = cognitoUserPool; 
    this.httpClient = httpClient;
    this.cognitoUserService = userCognito;
  }

  public async login(user: LoginUser): Promise<ReturnServiceCognito> {
    try{
      const userService = await this.cognitoUserService.getByEmail(user.login); 
      if(userService.error) {
        return {
          status: userService.status,
          error: userService.error,
        };
      }
      const { email } = userService.data;
      const { password } = user;
      const userLogin = await this.loginPassword(email, password);
      if(userLogin.error) {
        return {
          status: userLogin.status,
          error: userLogin.error,
        }
      }
  // ao final do login, o token(string) de acesso é retornado		
      return {
        status: true,
        data: userLogin.data,
      }
    } 
    catch(error){
      return {
      status: false,
      error: error.message,
      }
    }
	}


// metodo que ira retornar o token de acesso
	public async loginPassword(email: string, password: string): Promise<ReturnServiceCognito> {
    try {
      const result = await this.cognitoUserPool.authenticateUser({
				USERNAME: email,
				PASSWORD: password
				});
      return {
        status: true,
        data: result,
      };
    } catch (error) {
      if (error.__type === 'NotAuthorizedException') {
        return {
          status: false,
          error: 'Email ou senha inválidos'
        };
      }
      return {
        status: false,
        error: 'Erro desconhecido ao tentar fazer login'
      };
		}
  };
  public async validateAccessToken(token: string): Promise<ReturnServiceCognitoItem<ReturnValidateToken | JwtPayload>> {
		try {
			const decoded = decode(token, { complete: true });
      
			if (!decoded) {
				return {
					status: true,
					error: 'jwt invalido',
				};
			}
      const fetch = await this.fetchJwks();
      const jwks = fetch.data;
      const jwk = jwks.keys.find((x: any) => x.kid === decoded.header.kid);// retirei o as any
      const pem = jwkToPem(jwk);
			const data = verify(token, pem);
			return {
				status: true,
				data: data as ReturnValidateToken,
			};
	
		} catch (error) {
			return {
      status: false,
			error: error.message,
			};
		}
	};

  // metodo que  ira apenas verificar se o token de acesso é valido e caso seja retorna informacoes do usuario
  public async executeValidationRoutine(
    accessToken: string,
  ): Promise<ReturnServiceCognitoItem<ReturnexecuteValidationRoutine>> {
    try{
      const result = await this.validateAccessToken(
        accessToken,
      );
      if (result.error) {
        return {
          status: result.status,
          error: 'falha ao validar o token de acesso',
        };
      };
      const { username } = result.data;
      const emailResult = await this.cognitoUserService.getByEmail(username);
      const data= { data: {...emailResult, exp: result.data.exp, auth_time: result.data.auth_time}, status: true };
      return {status: true,  data: data as ReturnexecuteValidationRoutine  };
    } catch(error){
      return {
        status: false,
        error: error.message
      };
    }
  };
  // metodo que ira buscar os jwks do cognito
  public async fetchJwks(): Promise<any> {
    const headers = { 'Content-Type': 'application/json' };
    const baseURL = process.env.BASE_URL;
    const response = await this.httpClient.get(
      `${baseURL}/${this.cognitoUserPool.userPoolId}/.well-known/jwks.json`, headers,
    );
    return response;
  }
}