const express = require('express');
const path = require('path');

function createServer() {
  const app = express();
  const port = 3001;

 // Define o diretório de views e o mecanismo de template
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

 // Servir arquivos estáticos
  app.use(express.static(path.join(__dirname, '../public')));

 // Rota para acessar o arquivo CSS (se necessário)

  app.get('/public/css/reset.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'reset.css'));
  });

  app.get('/public/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'styles.css'));
  });

  app.get('/public/css/home-user.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'home-user.css'));
  });

  app.get('/public/css/dish-and-snack.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'dish-and-snack.css'));
  });

  app.get('/public/css/drinks.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'drinks.css'));
  });

  app.get('/public/css/menu-commands.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/css', 'menu-commands.css'));
  });

  // Rotas
  app.use('/', require('../routes/index'));

   // FIM ROTAS CSS ----------------------------------------------------------------------------------------------------

  // Inicia o servidor
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  return app;
}

module.exports = createServer;
