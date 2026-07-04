<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
// import TheWelcome from './components/TheWelcome.vue'
// import Counter from './components/Counter.vue'
// import Loginform from './components/LoginForm.vue'
// import Register from './components/Register.vue'
// import Forgotpassword from './components/Forgotpassword.vue'
// import Resetpassword from './components/Resetpassword.vue'

const route = useRoute()
const showBranding = computed(() => route.path !== '/dashboard')
</script>

<template>
  <header>
    <div class="brand-logo">
  <img src="./assets/logo.png" alt="WeatherNow" class="brand-img" />
        </div>
        <div class="wrapper">
        </div>
      </header>

  <main>
    <!-- <TheWelcome /> -->
  <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<style>
.app-inner {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.brand-img {
  width: 100%;
  max-width: 600px;
  height: auto;
  display: block;
}

body {
    background: #fff;
    min-height: 100vh;
    margin: 0;
}
</style>