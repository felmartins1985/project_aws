import { AuthCognitoService } from 'src/02-services/authCognito.service';
import {loginSchema} from 'src/01-presentation/controllers/schemas/cognitoLogin';
import {AuthCognitoServiceInterface } from 'src/02-services/interface/authCognitoServiceInterface'
import { Request, Response } from 'express';
export class AuthCognitoController {
  readonly authCognitoService: AuthCognitoServiceInterface;
  constructor(authCognitoService: AuthCognitoServiceInterface) {
    this.authCognitoService = authCognitoService;
  }
  public async login(req: Request, res: Response){
    try{
      const validate = loginSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const result = await this.authCognitoService.login(validate.data);
      if(result.error){
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch(error){
      console.log('ERROR AO TENTAR LOGAR NO CONTROLLER====>', error.message)
      return res.status(500).json(error.message);
    }
  };
  public async validateToken(req: Request, res: Response) {
    try{
      const token = req.headers.authorization;
      if(!token){
        return res.status(401).json({
          status: true,
          message: 'Token nao achado'
        });
      }
      const result = await this.authCognitoService.executeValidationRoutine(token);
      if(result.error){
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    }catch(error){
      console.log('ERROR AO TENTAR VALIDAR NO CONTROLLER====>', error.message)
      return res.status(500).json(error.message);
    }
  }
}