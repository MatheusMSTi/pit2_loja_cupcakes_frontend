const API_URL = "http://127.0.0.1:5000/api/cupcakes";

document.addEventListener('DOMContentLoaded', () => {
    fetchCupcakes();
});

async function fetchCupcakes() {
    const vitrine = document.getElementById('vitrine');
    
    try {

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const cupcakes = await response.json();

        vitrine.innerHTML = ''; 

        cupcakes.forEach(cupcake => {
            const card = document.createElement('div');
            card.className = 'cupcake-card';
            card.innerHTML = `
                ${cupcake.foto_url ? `<img src="${cupcake.foto_url}" alt="${cupcake.nome}">` : ''}
                <h3>${cupcake.nome}</h3>
                <p>${cupcake.descricao}</p>
                <p>Preço: R$ ${cupcake.preco.toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho('${cupcake.nome}')">Adicionar ao Carrinho</button>
            `;
            vitrine.appendChild(card);
        });

    } catch (error) {
        vitrine.innerHTML = `<p style="color: red;">Falha ao carregar cupcakes: ${error.message}. Verifique se sua API (Back-end) está rodando em ${API_URL}.</p>`;
        console.error("Erro ao buscar cupcakes:", error);
    }
}

function adicionarAoCarrinho(nomeCupcake) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    carrinho.push(nomeCupcake);
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert(`"${nomeCupcake}" adicionado ao carrinho! Total de itens: ${carrinho.length}.`);
    
    document.querySelector('a[href="#"]').textContent = `Carrinho (${carrinho.length})`;
}