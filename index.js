const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
const requests = { count: 0 };

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }
  req.project = project;
  req.project_index = projects.indexOf(project);
  return next();
}

function countRequests(req, res, next) {
  requests.count++;
  console.log(`Requests: ${requests.count}`);
  return next();
}

server.post('/projects', countRequests, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  res.json(projects);
});

server.get('/projects', countRequests, (req, res) => {
  res.json(projects);
});

server.put('/projects/:id', countRequests, checkProjectExists, (req, res) => {
  const { title } = req.body;
  projects[req.project_index].title = title;
  res.json(projects);
});

server.delete(
  '/projects/:id',
  countRequests,
  checkProjectExists,
  (req, res) => {
    users.splice(req.project_index, 1);
    return res.send();
  }
);
server.post(
  '/projects/:id/tasks',
  countRequests,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.project_index].tasks.push(title);
    res.json(projects);
  }
);

server.listen(3000);
