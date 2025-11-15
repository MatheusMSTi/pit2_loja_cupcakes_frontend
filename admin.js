const API_CUPCAKE_URL = "http://127.0.0.1:5000/api/cupcakes";

const adminPanel = document.getElementById('admin-panel');
const accessDenied = document.getElementById('access-denied');
const addCupcakeForm = document.getElementById('add-cupcake-form');
const adminMessage = document.getElementById('admin-message');
const logoutButton = document.getElementById('logout-button');

const deleteCupcakeForm = document.getElementById('delete-cupcake-form');
const deleteMessage = document.getElementById('delete-message');


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
    adminMessage.style.color = '#43b110ff';

    const novoCupcake = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value),
        estoque: parseInt(document.getElementById('estoque').value),
        foto_url: document.getElementById('foto_url').value || null
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


deleteCupcakeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cupcakeId = document.getElementById('cupcake-id').value;
    
    deleteMessage.textContent = 'Removendo produto...';
    deleteMessage.style.color = '#f44336';

    try {
        const response = await fetch(`${API_CUPCAKE_URL}/${cupcakeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.adminToken}` 
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            deleteMessage.textContent = `Sucesso! Cupcake ID ${cupcakeId} deletado. Recarregue a vitrine para verificar.`;
            deleteMessage.style.color = 'green';
            deleteCupcakeForm.reset();

        } else if (response.status === 404) {
            deleteMessage.textContent = `Erro 404: Cupcake ID ${cupcakeId} não encontrado.`;
            deleteMessage.style.color = 'red';
        } else {
            deleteMessage.textContent = `Erro: ${data.msg || 'Falha ao deletar'}`;
            deleteMessage.style.color = 'red';
        }

    } catch (error) {
        deleteMessage.textContent = 'Erro de conexão ou rede.';
        deleteMessage.style.color = 'red';
        console.error('Erro de rede:', error);
    }
});

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
});

checkAdminStatus();