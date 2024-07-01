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

router.get('/kitchen', (req, res) => {
    try {
        res.render('pages/kitchen');
    } catch (error) {
        console.log(error);
        res.render('pages/kitchen');
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
                    res.render('pages/menu-commands', { orders, idTable });
                } catch (error) {
                    console.log(error);
                    res.render('pages/menu-commands', { orders: [], idTable });
                }
            });

            // Rota para a página do carrinho de compras
            router.get('/:idTable/cart', async (req, res) => {
                const { idTable } = req.params;

                try {
                    // Buscar os itens do carrinho para a mesa especificada
                    const cartResponse = await axios.get(`http://localhost:3000/cart/table/${idTable}`);
                    const cartData = cartResponse.data;

                    // Buscar todos os produtos
                    const productsResponse = await axios.get('http://localhost:3000/products');
                    const productsData = productsResponse.data;

                    // Cruzar dados dos produtos com os itens do carrinho
                    const cartWithProductNames = cartData.map(item => {
                        const product = productsData.find(p => p.id === item.productId);
                        return {
                            ...item,
                            productName: product ? product.titleProducts : 'Produto não disponível'
                        };
                    });

                    console.log("idTable:", idTable);
                    console.log("Cart Data:", cartData);
                    console.log("Products Data:", productsData);
                    console.log("Cart with Product Names:", cartWithProductNames);

                    res.render('pages/cart', { data: cartWithProductNames, idTable });
                } catch (error) {
                    console.log(error);
                    res.render('pages/cart', { data: [], idTable });
                }
            });

            // Rota para deletar um item do carrinho
            router.delete('/cart/:idTable/item/:itemId', async (req, res) => {
                const { idTable, itemId } = req.params;

                try {
                    // Faça a requisição para deletar o item do carrinho
                    const response = await axios.delete(`http://localhost:3000/cart/table/${idTable}/item/${itemId}`);
                    
                    if (response.status === 200) {
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                } catch (error) {
                    console.error(error);
                    res.json({ success: false });
                }
            });

            // Chamada inicial para definir as rotas das categorias
            defineRouteCategories(idTable);
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
async function defineRouteCategories(idTable) {
    const categories = await getCategories();

    categories.forEach(category => {
        if (category) {
            const categoryRoute = category.toLowerCase().replace(/\s+/g, '-');

            router.get(`/${idTable}/${categoryRoute}`, async (req, res) => {
                try {
                    const response = await axios.get(`http://localhost:3000/products/category/${category}`);
                    const data = response.data;
                    res.render('pages/category', { category, data });
                } catch (error) {
                    console.log(error);
                    res.render('pages/category', { category, data: [] });
                }
            });
        }
    });
}

// Chamada inicial para definir as rotas
defineRouteTables();

module.exports = {
    router,
    defineRouteTables,
    defineRouteCategories
};
