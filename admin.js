
const API_CUPCAKE_URL = "http://127.0.0.1:5000/api/cupcakes";

const adminPanel = document.getElementById('admin-panel');
const accessDenied = document.getElementById('access-denied');
const addCupcakeForm = document.getElementById('add-cupcake-form');
const adminMessage = document.getElementById('admin-message');
const logoutButton = document.getElementById('logout-button');

function checkAdminStatus() {
    const token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (token && isAdmin) {
        adminPanel.style.display = 'block';
        accessDenied.style.display = 'none';
        
        window.adminToken = token;

    } else {
        adminPanel.style.display = 'none';
        accessDenied.style.display = 'block';
    }
}

addCupcakeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    adminMessage.textContent = 'Adicionando produto...';
    adminMessage.style.color = '#e91e63';

    const novoCupcake = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value),
        estoque: parseInt(document.getElementById('estoque').value)
    };

    try {
        const response = await fetch(API_CUPCAKE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.adminToken}` 
            },
            body: JSON.stringify(novoCupcake)
        });

        const data = await response.json();

        if (response.status === 201) {
            adminMessage.textContent = `Sucesso! Cupcake '${data.nome}' adicionado (ID: ${data.id}).`;
            adminMessage.style.color = 'green';
            addCupcakeForm.reset();

        } else if (response.status === 403) {
            adminMessage.textContent = 'Erro 403: Você não tem permissão de administrador.';
            adminMessage.style.color = 'red';
        } else {
            adminMessage.textContent = `Erro ${response.status}: ${data.msg || 'Falha ao adicionar'}`;
            adminMessage.style.color = 'red';
        }

    } catch (error) {
        adminMessage.textContent = 'Erro de conexão ou rede.';
        adminMessage.style.color = 'red';
        console.error('Erro de rede:', error);
    }
});

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
});

checkAdminStatus();