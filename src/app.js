const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // GET /repositories: Rota que lista todos os repositório
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /*
  POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, 
  sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto 
  no seguinte formato: 
  { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; 
  Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
  */

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  /* PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id 
    igual ao id presente nos parâmetros da rota;    
  */
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);  

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repositorio nao encontrado'});
  }

  const { likes } = repositories[repositoryIndex];  

  const { title, url, techs } = request.body;

  const updatedRepository = {
    id, title, url, techs, likes
  }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  // DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repositorio nao encontrado'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  /* POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através 
     do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
  */
  const { id } = request.params;
  console.log(id);

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);  

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repositorio nao encontrado'});
  }

  const { likes } = repositories[repositoryIndex];
  console.log(likes);

  repositories[repositoryIndex].likes = likes + 1;  

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
