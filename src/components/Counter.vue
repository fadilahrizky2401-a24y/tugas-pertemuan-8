// src/components/Counter.vue
<template>
    <div class="counter">
        <h2>Count: {{ count }}</h2>
        <p>Double: {{ double }}</p>

        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    name: 'Counter',
    setup() {
        const count = ref(0);

        const double = computed(() => count.value * 2);

        const increment = () => count.value++;
        const decrement = () => count.value--;

        return { count, double, increment, decrement };
    }
}
</script>

<style scoped>
.counter { padding: 20px; border: 1px solid #ccc; }
button { margin: 5px; padding: 8px 16px; }
</style>