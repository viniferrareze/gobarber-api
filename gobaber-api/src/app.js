import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    // chama o middlewares das rotas...
    this.server.use(routes);
  }
}

export default new App().server;