import { userSchema} from './schemas/userSchema'
import { userUpdateSchema} from './schemas/userUpdateSchema'
import {userCaseSchema} from './schemas/userCaseSchema'
import { UserDefinition } from 'src/03-model/userdefinition';
import { Request, Response } from 'express';
import {User} from 'src/03-model/interface/userType';
import { DynamoTable } from 'src/04-infrastructure/dynamodb.table';
import { UserServiceInterface } from 'src/02-services/interface/userServiceInterface';
import { DynamoTableInterface } from 'src/04-infrastructure/interface/dynamo-interface';
import { UserItem } from 'src/04-infrastructure/items/user-item'

export class UserBookController{
  public userService: UserServiceInterface;
  public dynamoTable: DynamoTableInterface;
  constructor(dynamoTable: DynamoTable, userService: UserServiceInterface){
    this.dynamoTable = dynamoTable;
    this.userService = userService;
  }
  async createUser(req: Request, res: Response) {
    try{
      const validate = userSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const newUser = UserDefinition.manufacture(req.body);
      const result = await this.userService.createUser(newUser);
      if(result.error){
        return res.status(404).json(result)
      }
      return res.status(201).json(result);
    }catch(error){
      console.log("=====> erro no create do user", error)
      return res.status(500).json(error.message);
    }
  }
  async getById(req: Request, res: Response) {
    try{
      const { id } = req.params;
      if(!id){
        return res.status(400).json({status: true, error: 'Id e necessario'})
      }
      const user = await this.userService.getById(id);
      if(user.error){
        return res.status(404).json(user)
      }
      return res.status(200).json(user);
    }catch(error){
      console.log("============> ERROR CONTROLLER  GET", error)
      return res.status(400).json(error.message);
    }
  }
  async updateUser(req: Request, res: Response){
    try{
      const {id, documento} = req.params;
      if(!id || !documento){
        return res.status(400).json({status: true, error: 'Id e documento sao obrigatorios'})
      }
      const findUser= await this.userService.getById(id);
      if(findUser.error){
        return res.status(400).json(findUser)
      }
      const validate = userUpdateSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const { nome, dataDeInicioOuNascimento, tipo, tipoDeDados } = findUser.data.data;
      const novoObjeto = {
        id,
        documento,
        nome,
        dataDeInicioOuNascimento,
        tipo,
        tipoDeDados,
        ...validate.data
      }
      const userUpdate = UserDefinition.manufacture(novoObjeto as User);
      const userItem = UserItem.From(userUpdate);
      const result = await this.userService.updateUser(userItem);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO CATCH DO UPDATE", error)
      return res.status(400).json(error.message);
    }
  }
  async getByDocument(req: Request, res: Response) {
    try{
      const { documento } = req.params;
      if(!documento){
        return res.status(400).json({status: true, error: 'documento e necessario'})
      }
      const doc = await this.userService.getByDocument(documento);
      if(doc.error){
        return res.status(404).json(doc)
      }
      return res.status(200).json(doc);
    }catch(error){
      console.log("============> ERROR NO CATCH DO GET BY NAME", error)
      return res.status(400).json(error.message);
    }
  }
  async userBookGet(req: Request, res: Response) {
    try{
      const { pkUsuario, pkLivro } = req.body;
      const validate = userCaseSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const result = await this.userService.takeBook(pkUsuario, pkLivro);
      if(result.error){
        return res.status(404).json(result)
      }
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO CATCH DO USERBOOKGET", error)
      return res.status(400).json(error.message);
    }
  }
  async userBookReturn(req: Request, res: Response) {
    try{
      const { pkUsuario, pkLivro } = req.body;
      const validate = userCaseSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const result = await this.userService.returnBook(pkUsuario, pkLivro);
      if(result.error){
        return res.status(404).json(result)
      }
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO CATCH DO USERBOOKRETURN", error)
      return res.status(400).json(error.message);
    }
  }
}