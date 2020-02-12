import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors';

import routes from './routes';

import './database';

class App {
   constructor() {
      this.server = express();

      Sentry.init(sentryConfig);

      this.middlewares();
      this.routes();
      this.exceptionHandler();
   }

   middlewares() {
      // deve ser colocado antes de qualquer rota, ou middlewares
      this.server.use(Sentry.Handlers.requestHandler());

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

      // O manipulador de erros deve estar antes de qualquer outro middleware de erro e depois de todos os controladores
      this.server.use(Sentry.Handlers.errorHandler());
   }

   exceptionHandler() {
      // middleware de 4 parametros é de tratamento de exceções
      this.server.use(async (err, req, res, next) => {
         if (process.env.NODE_ENV === 'development') {
            const errors = await new Youch(err, req).toJSON();

            return res.status(500).json(errors);
         }

         return res.status(500).json({ error: 'Internal server error' });
      });
   }
}

export default new App().server;
