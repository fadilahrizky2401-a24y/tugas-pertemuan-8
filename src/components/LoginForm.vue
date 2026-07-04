<template>
    <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
           <div class="password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
        <span class="toggle-icon" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
        </span>
    </div>
        </div>
        <button type="submit">Login</button>
        <label for="register" class="register-label">Don't have an account? <a href="/register">Register</a></label>
        <label for="forgot-password" class="register-label"><a href="/forgot-password">Forgot Password?</a></label>
        </form>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const API_BASE_URL = 'http://localhost:3002/api/auth';

export default {
    name: 'LoginForm',

    setup() {
        const username = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const router = useRouter();
        const authStore = useAuthStore();


        const handleLogin = async () => {
            // Validasi Username
            if (!username.value) {
                alert('Username wajib diisi');
                return;
            }

            if (username.value.length < 3) {
                alert('Username minimal 3 karakter');
                return;
            }

            const usernameRegex = /^[A-Za-z]+$/;

            if (!usernameRegex.test(username.value)) {
                alert('Username tidak boleh mengandung angka');
                return;
            }

            // Validasi Password
            if (!password.value) {
                alert('Password wajib diisi');
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!passwordRegex.test(password.value)) {
                alert(
                    'Password minimal 8 karakter, mengandung huruf kapital dan angka'
                );
                return;
            }

            // Jika semua validasi berhasil
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username.value,
                        password: password.value,
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    alert(result.message || 'Login gagal.');
                    return;
                }

                authStore.login(username.value);
                alert(result.message || 'Login berhasil.');
                router.push('/dashboard');
            } catch (_error) {
                alert('Backend belum berjalan atau terjadi kesalahan jaringan.');
            }
        };

        return { username, password, showPassword, handleLogin };
    }
}
</script>
<style scoped>
.login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ebe1e8;
    border-radius: 8px;
    background-color: hsl(204, 45%, 74%);
}

.sky {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.register-label{
    display: block;
    margin-top: 1rem;
    text-align: center;
}
.form-group {
    margin-bottom: 1rem;
}
label {
    display: block;
    margin-bottom: 0.5rem;
}
input {
    width: 100%;
    padding: 0.5rem;        
    border: 1px solid #f7eeee;
    border-radius: 4px;
}
button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #76caa4; 
    color: white;
    font-size: 1rem;
    cursor: pointer;
}
button:hover {
    background-color: #38a173;
}                    

.register-label a {
    color: #ffffff;
    font-weight: 600;
    text-decoration: none;
}

.register-label a:hover {
    color: #ffd700;
    text-decoration: underline;
}
.password-wrapper {
    position: relative;
}
.password-wrapper input {
    width: 100%;
    padding-right: 2.5rem;
}
.toggle-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 1.1rem;
    user-select: none;
}
</style>