document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#tabela_produtos tbody');

  
    function fetchProducts() {
        fetch('http://localhost:3000/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ', response.statusText);
                }
                return response.json();
            })
            .then(products => {
                tableBody.innerHTML = '';

                if (products.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado.</td></tr>';
                }

                products.forEach(product => {
                    const row = createProductRow(product);
                    tableBody.appendChild(row);
                });

            })
            .catch(error => {
                console.error('Erro ao buscar produtos:', error);
            });
    }

    // Função para criar uma linha na tabela para um produto
    function createProductRow(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="td">
                <img src="/imgs/lancheEbebida.png" alt="${product.titleProducts}" class="product-image">
            </td>
            <td class="td">${product.titleProducts.toUpperCase() || 'N/A'}</td>
            <td class="td">${product.foodStatus.toUpperCase() || 'N/A'}</td>
            <td class="td">R$:${product.price || 'N/A'}</td>
            <td class="td">${product.quantity || 'N/A'}</td>
            <td class="td td-buttons">
                <button type="button" class="edit-button button button-edit" data-product-id="${product.id}">
                    <img src="/imgs/editar.png" alt="editar" class="edit-image">
                </button>
                <button type="button" class="delete-button button button-delete" data-product-id="${product.id}">
                    <img src="/imgs/lixeira2.png" alt="lixeira" class="delete-image">
                </button>
            </td>
        `;
        return row;
    }

    // Event listener para o botão de sair
    const botaoSair = document.getElementById('botao_sair');
    botaoSair.addEventListener('click', function() {
        window.location.href = '/menu-adm';
    });

    // Event listener para o botão de adicionar produtos
    const botaoAdcMesas = document.getElementById('botao_adc_mesas');
    botaoAdcMesas.addEventListener('click', function() {
        window.location.href = '/product-adm';
    });

    // Event listener para editar ou deletar produto
    tableBody.addEventListener('click', function(event) {
        const target = event.target;

        // Verifica se o clique foi no botão de editar
        if (target.closest('.edit-button')) {
            const productId = target.closest('.edit-button').dataset.productId;
            editProduct(productId);
        }

        // Verifica se o clique foi no botão de deletar
        if (target.closest('.delete-button')) {
            const productId = target.closest('.delete-button').dataset.productId;
            deleteProduct(productId);
        }
    });

// Função para editar um produto
function editProduct(productId) {
    fetch(`http://localhost:3000/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar produto para edição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(product => {
            const newTitle = prompt('Digite o novo nome do produto:', product.titleProducts);
            const newFoodStatus = prompt('Digite a nova categoria do produto:', product.foodStatus);
            const newPrice = prompt('Digite o novo preço do produto:', product.price);
            const newQuantity = prompt('Digite a nova quantidade do produto:', product.quantity);

            if (newTitle !== null && newFoodStatus !== null && newPrice !== null && newQuantity !== null) {
                fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        titleProducts: newTitle,
                        foodStatus: newFoodStatus,
                        price: parseFloat(newPrice),
                        quantity: parseInt(newQuantity)
                    })
                })
                .then(response => {
                    if (response.ok) {
                        fetchProducts(); // Atualiza a lista de produtos após edição
                    } else {
                        throw new Error(`Falha ao editar produto: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('Erro ao editar produto:', error);
                });
            }
        })
        .catch(error => {
            console.error(error.message);
        });
}

    // Função para deletar um produto
    function deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    fetchProducts(); // Atualiza a lista de produtos após exclusão
                } else {
                    console.error('Falha ao deletar produto:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Erro ao deletar produto:', error);
            });
        }
    }

    // Chamar a função para buscar e exibir os produtos ao carregar a página
    fetchProducts();
});
