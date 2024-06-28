const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemon = require('nodemon');

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
        console.log("getOrders:", response.data.orders);
        return response.data.orders;
    } catch (error) {
        console.error(`Erro ao obter os pedidos para a mesa ${idTable}:`, error);
        return [];
    }
}

// Rota para a página de LOGIN
router.get('/', (req, res) => {
    try {
        res.render('pages/login');
    } catch (error) {
        console.log(error);
        res.render('pages/login');
    }
});

router.get('/menu-adm', (req, res) => {
    try {
        nodemon.restart();
        res.render('pages/menu-adm');
    } catch (error) {
        console.log(error);
        res.render('pages/menu-adm');
    }
});

router.get('/table-adm', (req, res) => {
    try {
        nodemon.restart();
        res.render('pages/table-adm');
    } catch (error) {
        console.log(error);
        res.render('pages/table-adm');
    }
});

router.get('/list-product', (req, res) => {
    try {
        res.render('pages/list-product');
    } catch (error) {
        console.log(error);
        res.render('pages/list-product');
    }
});

router.get('/product-adm', (req, res) => {
    try {
        res.render('pages/product-adm');
    } catch (error) {
        console.log(error);
        res.render('pages/product-adm');
    }
});

router.get('/open-orders', (req, res) => {
    try {
        res.render('pages/open-orders');
    } catch (error) {
        console.log(error);
        res.render('pages/open-orders');
    }
});

router.get('/qrcode-adm', (req, res) => {
    try {
        res.render('pages/qrcode-adm');
    } catch (error) {
        console.log(error);
        res.render('pages/qrcode-adm');
    }
});

// Função para definir as rotas das mesas dinamicamente
async function defineRouteTables() {
    const tables = await getTables();

    tables.forEach(table => {
        const { idTable } = table;

        if (idTable) {
            // Rota Menu User
            router.get(`/${idTable}`, async (req, res) => {
                try {
                    const response = await axios.get('http://localhost:3000/');
                    const data = response.data;
                    nodemon.restart();
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
                    console.log("Lista de pedidos", orders);
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

// Função para obter as categorias dos produtos
async function getCategories() {
    try {
        const response = await axios.get('http://localhost:3000/categories');
        return response.data;
    } catch (error) {
        console.error("Erro ao obter as categorias:", error);
        return [];
    }
}

// Função para definir as rotas das categorias dinamicamente
async function defineRouteCategories() {
    const categories = await getCategories();

    categories.forEach(category => {
        if (category) {
            const categoryRoute = category.toLowerCase().replace(/\s+/g, '-');
            console.log("HEREEE:",categoryRoute);
            console.log("2222222222:",category)

            router.get(`/${categoryRoute}`, async (req, res) => {
                try {
                    const response = await axios.get(`http://localhost:3000/products/category/${category}`);
                    console.log("RESPONSAVEL:", response);
                    const data = response.data;
                    console.log()
                    res.render('pages/category', { category, data });
                } catch (error) {
                    console.log(error);
                    res.render('pages/category', { category, data: [] });
                }
            });
        }
    });
}

// Chamada inicial para definir as rotas das categorias
defineRouteCategories();

// Chamada inicial para definir as rotas
defineRouteTables();

module.exports = {
    router,
    defineRouteTables,
    defineRouteCategories
};
