<template>
    <div class="forgot-password-form">
        <h2>Forgot Password</h2>
        <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="email" placeholder="Enter your registered email" />
        </div>
        <button type="submit">Send Reset Link</button>
        </form>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    name: 'ForgotPasswordForm',

    setup() {
        const email = ref('');

        const handleForgotPassword = () => {

            // Email wajib diisi
            if (!email.value) {
                alert('Email wajib diisi');
                return;
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.value)) {
                alert('Email tidak valid');
                return;
            }

            // Jika validasi berhasil
            alert('Link reset password berhasil dikirim ke email Anda');
        };

        return {
            email,
            handleForgotPassword
        };
    }
}
</script>

<style scoped>
.forgot-password-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #e95a5a;
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
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: white;
}
</style>