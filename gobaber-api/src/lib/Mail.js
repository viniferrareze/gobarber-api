import nodemailer from 'nodemailer';

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
   }

   sendMail(message) {
      return this.transporter.sendMail({
         ...mailConfig.default, // joga tdo que tiver por default
         ...message, // joga tdo que tiver de message
      });
   }
}

export default new Mail();
