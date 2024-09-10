import { UserCognitoService } from 'src/02-services/userCognito.service';
import { registerCognitoUserSchema} from 'src/01-presentation/controllers/schemas/cognitoNewUser';
import { Request, Response } from 'express';
import { UserCognitoServiceInterface } from 'src/02-services/interface/userCognitoServiceInterface';
export class UserCognitoController {
  readonly cognitoUserService: UserCognitoServiceInterface;
  constructor(cognitoUserService: UserCognitoServiceInterface) {
    this.cognitoUserService = cognitoUserService;
  }
  public async createUser(req: Request, res: Response){
    try{
      const validate = registerCognitoUserSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const result = await this.cognitoUserService.createUser(validate.data);
      if(result.error){
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch(error){
      console.log('ERROR AO TENTAR CRIAR NO CONTROLLER====>', error.message)
      return res.status(500).json(error.message);
    }
  };

}