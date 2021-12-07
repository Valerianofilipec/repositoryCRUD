const express = require("express");
const req = require("express/lib/request");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryById(request, response, next){
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  
 
  request.repositoryIndex = repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories",(request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryById, (request, response) => {
  const updatedRepository = request.body;
  const {repositoryIndex} = request;
  

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoryById, (request, response) => {
  const {repositoryIndex} = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryById, (request, response) => {
  const {repositoryIndex} = request;
  const like =  repositories[repositoryIndex].likes + 1;
  
  const repository = { ...repositories[repositoryIndex], ...{likes: like} };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
