import { Request, Response, Router } from 'express';
import { AuthCognitoController } from 'src/01-presentation/controllers/authCognitoController';
import { AuthCognitoService } from 'src/02-services/authCognito.service';
import { CognitoPool } from "src/04-infrastructure/cognitoUser";
import { AxiosAdapter } from 'src/03-model/axios-adapter';
import { UserCognitoService } from 'src/02-services/userCognito.service';

const routes = Router();
const httpClient = new AxiosAdapter();
const cognitoUserPool = new CognitoPool(process.env.USER_POOL_ID,process.env.USER_POOL_CLIENT_ID);
const userCognitoService = new UserCognitoService(cognitoUserPool);
const cognitoService = new AuthCognitoService(cognitoUserPool, httpClient,userCognitoService);
const authCognitoController = new AuthCognitoController(cognitoService);

routes.post('/login', (req: Request, res: Response) => authCognitoController.login(req, res));
routes.post('/validateToken', (req: Request, res: Response) => authCognitoController.validateToken(req, res));
export default routes;