import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
   constructor() {
      this.server = express();

      this.middlewares();
      this.routes();
   }

   middlewares() {
      this.server.use(express.json());

      // habilita a pasta para fornecer arquivos estaticos
      this.server.use(
         '/files',
         express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
      );
   }

   routes() {
      // chama o middlewares das rotas...
      this.server.use(routes);
   }
}

export default new App().server;
