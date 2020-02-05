import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
   // como o multer vai guardar os arquivos de imagem
   storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destinos dos arquivos
      filename: (req, file, cb) => {
         // como deve ser formatado o nome do arquivo na imagem
         crypto.randomBytes(16, (err, res) => {
            if (err) return cb(err); // se der erro passa o cb.

            return cb(null, res.toString('hex') + extname(file.originalname));
         });
      },
   }),
};
