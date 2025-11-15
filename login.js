
const API_LOGIN_URL = "http://127.0.0.1:5000/api/login";
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginMessage.textContent = 'Autenticando...';
    loginMessage.style.color = '#e91e63';

    try {
        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('is_admin', data.is_admin);
            localStorage.setItem('user_id', data.user_id);
            
            loginMessage.textContent = 'Login bem-sucedido! Redirecionando para o painel...';
            loginMessage.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);

        } else if (response.status === 401) {
            loginMessage.textContent = 'Erro: E-mail ou senha incorretos.';
            loginMessage.style.color = 'red';
        } else {
            loginMessage.textContent = `Erro ${response.status}: ${data.msg || 'Falha na autenticação'}`;
            loginMessage.style.color = 'red';
        }

    } catch (error) {
        loginMessage.textContent = 'Erro de conexão. Verifique se a API está rodando na porta 5000.';
        loginMessage.style.color = 'red';
        console.error('Erro de rede:', error);
    }
});