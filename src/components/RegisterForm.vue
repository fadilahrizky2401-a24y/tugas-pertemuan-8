<template>
    <div class="register-form">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required />
        </div>
         <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required />
        </div>      
        <div class="form-group">
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" required />
        </div>

        <button type="submit">Register</button>
        <label for="login" class="register-label">Already have an account? <a href="/login">Login</a></label>
        </form>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const API_BASE_URL = 'http://localhost:3002/api/auth';

export default {
    name: 'RegisterForm',

    setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const handleRegister = async () => {

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

        // Validasi Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.value) {
            alert('Email wajib diisi');
            return;
        }

        if (!emailRegex.test(email.value)) {
            alert('Email tidak valid');
            return;
        }

        // Validasi Password
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password.value)) {
            alert('Password minimal 8 karakter, mengandung huruf kapital dan angka');
            return;
        }

        // Validasi Confirm Password
        if (password.value !== confirmPassword.value) {
            alert('Password dan Confirm Password tidak sama');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value,
                    confirmPassword: confirmPassword.value
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Registrasi gagal.');
                return;
            }

            authStore.login(username.value);
            alert(result.message || 'Registrasi berhasil.');
            router.push('/Login');

        } catch (error) {
            alert('Backend belum berjalan atau terjadi kesalahan jaringan.');
        }
    };

    return {
        username,
        email,
        password,
        confirmPassword,
        handleRegister
    };
}
}

</script>
<style scoped>
.register-label{
    display: block;
    margin-top: 1rem;
    text-align: center;
}
.register-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #d1cdcd;
    border-radius: 8px;
    background-color: #f9f9f9;
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
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #42b983; 
    color: white;
    font-size: 1rem;
    cursor: pointer;
}
button:hover {
    background-color: #38a173;
}                    
</style>