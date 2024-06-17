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
 

  // Rotas
  app.use('/', require('../routes/index'));

 

  // Inicia o servidor
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  return app;
}

module.exports = createServer;
