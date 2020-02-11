import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

class Mail {
   constructor() {
      const { host, port, secure, auth } = mailConfig;

      this.transporter = nodemailer.createTransport({
         host,
         port,
         secure,
         auth: auth.user ? auth : null, // se existir o usuário passa o mesmo se nao envia null
      });

      this.configTemplates();
   }

   configTemplates() {
      const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

      this.transporter.use(
         'compile', // como ele compila os templates de emails
         nodemailerhbs({
            viewEngine: exphbs.create({
               layoutsDir: resolve(viewPath, 'layouts'),
               partialsDir: resolve(viewPath, 'partials'),
               defaultLayout: 'default',
               extname: '.hbs',
            }),
            viewPath,
            extName: '.hbs',
         })
      );
   }

   sendMail(message) {
      return this.transporter.sendMail({
         ...mailConfig.default, // joga tdo que tiver por default
         ...message, // joga tdo que tiver de message
      });
   }
}

export default new Mail();
