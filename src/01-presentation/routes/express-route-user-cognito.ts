import { Request, Response, Router } from 'express';
import { UserCognitoController } from 'src/01-presentation/controllers/userCognitoController';
import { CognitoPool } from "src/04-infrastructure/cognitoUser";
import { UserCognitoService } from 'src/02-services/userCognito.service';

const routes = Router();
const cognitoUserPool = new CognitoPool(process.env.USER_POOL_ID,process.env.USER_POOL_CLIENT_ID);
const userCognitoService = new UserCognitoService(cognitoUserPool);
const userCognitoController = new UserCognitoController(userCognitoService);

routes.post('/createUser', (req: Request, res: Response) => userCognitoController.createUser(req, res));
export default routes;