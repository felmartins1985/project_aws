import { Request, Response, Router } from 'express';
import { UserBookController } from 'src/01-presentation/controllers/userBookController';
import { DynamoTable } from 'src/04-infrastructure/dynamodb.table';
import { AxiosAdapter } from 'src/03-model/axios-adapter';
import { BookService } from 'src/02-services/book.service';
import { UserService } from 'src/02-services/user.service';

const routes = Router();
const httpClient = new AxiosAdapter();
const dynamoTable = new DynamoTable(process.env.TABLE_NAME);
const bookService =new BookService(dynamoTable, httpClient);
const userService = new UserService(dynamoTable, bookService);
const userBookController = new UserBookController(dynamoTable, userService);

routes.post('/returnABook', (req: Request, res: Response) => userBookController.userBookReturn(req, res));
routes.post('/takeABook', (req: Request, res: Response) => userBookController.userBookGet(req, res));
routes.post('/',(req: Request, res: Response) => userBookController.createUser(req, res));
routes.get('/userById/:id', (req: Request, res: Response) => userBookController.getById(req, res));
routes.get('/userByDocument/:documento', (req: Request, res: Response) => userBookController.getByDocument(req, res));
routes.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json('Hello World!');
  } catch (error) {
    res.status(500).json({
      error: error.stack,
    });
  }
});


export default routes;
