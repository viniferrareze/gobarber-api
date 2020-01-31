const express = require('express');

const server = express();

server.use(express.json());

server.use( (req, res, next) => {
   console.count("Número de Requisições");

   return next();
});

function checkInIdProject(req, res, next) {
   const { id } = req.params;

   const project = projects.find(obj => obj.id == id);

   if (!project) {
      return res.status(400).json({ error: 'Project does not exists'});
   }

   return next();
}

const projects = [];

server.post('/projects', (req, res) => {
   const { id, title } = req.body;

   const project = {
      id,
      title,
      task: []
   };

   projects.push(project)

   return res.send(project);
});

server.get('/projects', (req, res) => {
   return res.json(projects);
});

server.put('/projects/:id', checkInIdProject, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;

   const project = projects.find(obj => obj.id == id);
   project.title = title;

   return res.json(project);
});

server.delete('/projects/:id', checkInIdProject, (req, res) => {
   const { id } = req.params;

   const index = projects.findIndex(obj => obj.id == id);

   projects.splice(index, 1);

   return res.send();
});

server.post('/projects/:id/task', checkInIdProject, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;
   
   const project = projects.find(obj => obj.id == id); 
   project.task.push(title);

   return res.send(project);
});

server.listen(3001, ()=> {
   console.log('Servidor rodando...');
});