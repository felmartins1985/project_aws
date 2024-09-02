import { Request, Response, Router } from 'express';
import { BookController } from 'src/01-presentation/controllers/bookController';
import { DynamoTable } from 'src/04-infrastructure/dynamodb.table';
import { BookService } from 'src/02-services/book.service';
import {AxiosAdapter} from 'src/03-model/axios-adapter'

const routes = Router();
const httpClient = new AxiosAdapter();
const dynamoTable = new DynamoTable(process.env.TABLE_NAME);
const bookService =new BookService(dynamoTable, httpClient);
const bookController = new BookController(dynamoTable, bookService);


routes.post('/',(req: Request, res: Response) => bookController.createBook(req, res));
routes.get('/bookById/:id', (req: Request, res: Response) => bookController.getById(req, res));
routes.get('/bookByName/:nome', (req: Request, res: Response) => bookController.getByName(req, res));
routes.put('/book/:id/:nome', (req: Request, res: Response) => bookController.updateBook(req, res));

export default routes;
