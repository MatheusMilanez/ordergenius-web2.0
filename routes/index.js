const express = require('express');
const router = express.Router();
const axios = require('axios');

// Função para obter as mesas
async function getTables() {
    try {
        const response = await axios.get('http://localhost:3000/tables');
        return response.data;
    } catch (error) {
        console.error("Erro ao obter as mesas:", error);
        return [];
    }
}

// Função para obter os pedidos de uma mesa específica
async function getOrders(idTable) {
    try {
        const response = await axios.get(`http://localhost:3000/tables/${idTable}/orders`);
        console.log("getOrders:",response.data.orders)
        return response.data.orders;
    } catch (error) {
        console.error(`Erro ao obter os pedidos para a mesa ${idTable}:`, error);
        return [];
    }
}


// Função para definir as rotas
async function defineRoutes() {
    const tables = await getTables();

    tables.forEach(table => {
        const { idTable, title } = table;

        if (idTable) {
            // Rota Menu User
            router.get(`/${idTable}/`, async (req, res) => {
                try {
                    const response = await axios.get('http://localhost:3000/');
                    const data = response.data;
                    res.render('pages/home-user', { data, idTable });
                } catch (error) {
                    console.error(error);
                    res.render('pages/home-user', { data: null, idTable });
                }
            });

            // Rota menu Petiscos
            router.get(`/${idTable}/menu-dish-and-snack`, async (req, res) => {
                try {
                    const response = await axios.get('http://localhost:3000/');
                    const data = response.data;
                    res.render('pages/menu-dish-and-snack', { data, idTable });
                } catch (error) {
                    console.log(error);
                    res.render('pages/menu-dish-and-snack', { data: null, idTable });
                }
            });

            // Rotas bebidas
            router.get(`/${idTable}/menu-drinks`, async (req, res) => {
                try {
                    const response = await axios.get('http://localhost:3000/');
                    const data = response.data;
                    res.render('pages/menu-drinks', { data, idTable });
                } catch (error) {
                    console.log(error);
                    res.render('pages/menu-drinks', { data: null, idTable });
                }
            });

            // Rota para a página de comandos
            router.get(`/${idTable}/menu-commands`, async (req, res) => {
                try {
                    const orders = await getOrders(idTable);
                    console.log("Lista de pedidos",orders)
                    res.render('pages/menu-commands', { orders, idTable });
                } catch (error) {
                    console.log(error);
                    res.render('pages/menu-commands', { orders: [], idTable });
                }
            });





        } else {
            console.log("Não existe essa mesa");
        }
    });
}

// Chama a função para definir as rotas
defineRoutes();

module.exports = router;
