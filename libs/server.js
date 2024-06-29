const express = require('express');
const path = require('path');
const { router, defineRouteTables } = require('../routes/index');

async function createServer() {
    const app = express();
    const port = 3001;

    // Define o diretório de views e o mecanismo de template
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

  // Servir arquivos estáticos
  app.use(express.static(path.join(__dirname, '../public')));
  


    // Middleware para análise do corpo das requisições
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rotas estáticas
    app.use(router);

    // Inicia o servidor
    app.listen(port, async () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
        // Definir rotas dinâmicas após iniciar o servidor
        await defineRouteTables(app);
    });

    return app;
}

module.exports = createServer;
