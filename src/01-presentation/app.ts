import cors from 'cors';
import express, { Express } from 'express';
import serverless from 'serverless-http';
import expressRoute from 'src/01-presentation/routes/express-route'
import expressRouteBook from 'src/01-presentation/routes/express.route-book';
import expressRouteAuth from 'src/01-presentation/routes/express-route-auth-cognito';
import expressRouteUserCognito from 'src/01-presentation/routes/express-route-user-cognito';
export class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(`/express/user`, expressRoute);
    this.app.use(`/express/book`, expressRouteBook);
    this.app.use(`/express/auth`, expressRouteAuth);
    this.app.use(`/express/cognito`, expressRouteUserCognito);
  }
}

export const { app } = new App();
export const handler = serverless(app);
