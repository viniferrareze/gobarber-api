const express = require('express');

const server = express();

//express deve ler json da requisição
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "nome": "Vini", "email": "vini@email.com" }

//query params
// server.get('/teste', (req, res) => {
//    const nome = req.query.nome;     

//    return res.json({ message: `Hello World ${nome}` });
// });

const uesrs = ['Diego', 'Clâudio', 'Victor'];

//midllew global
server.use((req, res, next) => {
   console.time('Request');
   console.log(`Método: ${req.method}; URL: ${req.url}`);

   next();

   console.timeEnd('Request');
});

//midleaw local
function checkUserExists(req, res, next) {
   if (!req.body.name) {
      return res.status(400).json({ error: 'User name is required'});
   }

   return next();
}

function checkUserInArray(req, res, next) {
   const user = uesrs[req.params.index];

   if (!user) {
      return res.status(400).json({ error: 'User does not exists'});
   }

   req.user = user;

   next();
}

//busca todos os registros
server.get('/users', (req, res) => {
   return res.json(uesrs); 
});

//route params
server.get('/users/:index', checkUserInArray, (req, res) => {
   //const { index } = req.params;     

   return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
   const { name } = req.body;

   uesrs.push(name);

   return res.json(uesrs);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
   const { index } = req.params; 
   const { name } = req.body;

   uesrs[index] = name;

   return res.json(uesrs);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
   const { index } = req.params;

   uesrs.splice(index, 1);

   return res.send();
});

server.listen(3000);