<template>
    <div class="reset-password-form">
        <h2>Reset Password</h2>
        <form @submit.prevent="handleResetPassword">
        
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your reset-password email" required />
        </div>
         <div class="form-group">
            <label for="password">New Password:</label>
            <input type="password" id="password" v-model="password" placeholder="Enter new password"  required />
        </div>      
        <div class="form-group">
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" v-model="confirmNewPassword" required />
        </div>

        <button type="submit">Resetpassword</button>
        <label for="login" class="ResetPassword">Back to login <a href="/login">Login</a></label>
        </form>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    name: 'ResetPassword',

    setup() {
        const email = ref('');
        const password = ref('');
        const confirmNewPassword = ref('');

        const handleResetPassword = () => {

            // Validasi Email
            if (!email.value) {
                alert('Email wajib diisi');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.value)) {
                alert('Email tidak valid');
                return;
            }

            // Validasi Password
            if (!password.value) {
                alert('Password baru wajib diisi');
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!passwordRegex.test(password.value)) {
                alert(
                    'Password minimal 8 karakter, mengandung huruf kapital dan angka'
                );
                return;
            }

            // Validasi Confirm Password
            if (!confirmNewPassword.value) {
                alert('Confirm Password wajib diisi');
                return;
            }

            if (password.value !== confirmNewPassword.value) {
                alert('Password dan Confirm Password tidak sama');
                return;
            }

            // Jika semua validasi berhasil
            alert('Password berhasil direset');
        };

        return {
            email,
            password,
            confirmNewPassword,
            handleResetPassword
        };
    }
}
</script>
<style scoped>
.reset-password-label{
    display: block;
    margin-top: 1rem;
    text-align: center;
}
.reset-password-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #963030;
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