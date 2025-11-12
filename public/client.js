const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logOutput = document.getElementById('logOutput');
const loginButton = document.getElementById('loginButton');
const logBox = document.querySelector('.log-box');

function log(message) {
    logOutput.innerHTML += message + '\n';
    logBox.scrollTop = logBox.scrollHeight;
}

const delay = ms => new Promise(res => setTimeout(res, ms));


loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    logBox.style.display = 'block';
    
    logOutput.innerHTML = ''; 
    loginButton.disabled = true; 
    loginButton.innerHTML = 'Memproses...';

    const username = usernameInput.value;
    const password = passwordInput.value;

    log(`[CLIENT] Mengirim data ke server: { user: "${username}" }`);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        for (const message of data.log) {
            await delay(400);
            log(message);
        }

        if (!response.ok) {
            await delay(400);
            log(`[CLIENT] Gagal menerima respons dari server.`);
        }

    } catch (error) {
        await delay(400);
        log(`[CLIENT] Error: Tidak bisa terhubung ke server. ${error.message}`);
    } finally {
        loginButton.disabled = false; 
        loginButton.innerHTML = 'Login';
    }
});