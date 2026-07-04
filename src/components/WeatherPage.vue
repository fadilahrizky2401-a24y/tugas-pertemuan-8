<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-icon">🌤️</span>
          <span class="brand-name">WeatherNow</span>
        </div>
        <div class="user-area">
          <span class="welcome-text">{{ authStore.username || 'User' }}</span>
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="main">
      <!-- Search -->
      <div class="search-section">
        <h1 class="page-title">Cek Cuaca Hari Ini</h1>
        <div class="search-bar">
          <input
            v-model="cityInput"
            type="text"
            placeholder="Masukkan nama kota..."
            class="search-input"
            @keyup.enter="fetchWeather"
          />
          <button class="search-btn" @click="fetchWeather" :disabled="loading">
            <span v-if="loading">⏳</span>
            <span v-else>🔍 Cari</span>
          </button>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>

      <!-- Weather Card -->
      <transition name="fade">
        <div v-if="weather" class="weather-card">
          <!-- Top: City & Date -->
          <div class="card-top">
            <div>
              <h2 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h2>
              <p class="date-text">{{ currentDate }}</p>
            </div>
            <div class="weather-icon-big">
              <img :src="iconUrl" :alt="weather.weather[0].description" />
            </div>
          </div>

          <!-- Temp -->
          <div class="temp-section">
            <span class="temp-value">{{ Math.round(weather.main.temp) }}</span>
            <span class="temp-unit">°C</span>
          </div>
          <p class="weather-desc">{{ capitalize(weather.weather[0].description) }}</p>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-icon">💧</span>
              <span class="stat-value">{{ weather.main.humidity }}%</span>
              <span class="stat-label">Kelembapan</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🌬️</span>
              <span class="stat-value">{{ weather.wind.speed }} m/s</span>
              <span class="stat-label">Angin</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🌡️</span>
              <span class="stat-value">{{ Math.round(weather.main.feels_like) }}°C</span>
              <span class="stat-label">Terasa</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ (weather.visibility / 1000).toFixed(1) }} km</span>
              <span class="stat-label">Jarak Pandang</span>
            </div>
          </div>

          <!-- Min/Max -->
          <div class="minmax-bar">
            <span>↓ Min: {{ Math.round(weather.main.temp_min) }}°C</span>
            <span>↑ Max: {{ Math.round(weather.main.temp_max) }}°C</span>
          </div>
        </div>
      </transition>

      <!-- Empty State -->
      <div v-if="!weather && !loading" class="empty-state">
        <div class="empty-icon">🌍</div>
        <p>Masukkan nama kota untuk melihat informasi cuaca.</p>
      </div>
    </main>
  </div>

  <users-table/>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
// import UsersTable from './UsersTable.vue';

const router = useRouter();
const authStore = useAuthStore();

const cityInput = ref('');
const weather = ref(null);
const loading = ref(false);
const errorMsg = ref('');

// Ganti dengan API key OpenWeatherMap kamu
const API_KEY = '79af3b5cbeca695ee381ff10c8152ade';

const iconUrl = computed(() => {
  if (!weather.value) return '';
  const code = weather.value.weather[0].icon;
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const fetchWeather = async () => {
  if (!cityInput.value.trim()) {
    errorMsg.value = 'Nama kota tidak boleh kosong.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';
  weather.value = null;

  try {
    const res = await fetch(
      `http://localhost:3002/api/weather/${encodeURIComponent(cityInput.value)}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        errorMsg.value = 'Kota tidak ditemukan. Coba periksa ejaan.';
      } else if (res.status === 401) {
        errorMsg.value = 'API key tidak valid. Periksa konfigurasi.';
      } else {
        errorMsg.value = 'Gagal mengambil data cuaca.';
      }
      return;
    }

    weather.value = await res.json();
  } catch {
    errorMsg.value = 'Terjadi kesalahan jaringan.';
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* ── Layout ── */
.dashboard-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #fff;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

/* ── Header ── */
.header {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsl(204, 45%, 74%);
  border: 1px solid #ebe1e8;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}
.brand-icon { font-size: 1.3rem; }
.user-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.welcome-text {
  font-size: 0.9rem;
  color: #666;
}
.logout-btn {
  padding: 0.4rem 1rem;
  background-color: #e53e3e;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover { background-color: #c53030; }

/* ── Main Card ── */
.main {
  width: 100%;
  max-width: 500px;
  background-color: hsl(204, 45%, 74%);
  border: 1px solid #ebe1e8;
  border-radius: 8px;
  padding: 2rem;
}

/* ── Search ── */
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #333;
}
.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #f7eeee;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.search-input::placeholder { color: #aaa; }
.search-input:focus { border-color: #76caa4; }
.search-btn {
  padding: 0.5rem 1.1rem;
  border-radius: 4px;
  border: none;
  background-color: #76caa4;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.search-btn:hover:not(:disabled) { background-color: #38a173; }
.search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg {
  color: #e53e3e;
  margin-top: 0.4rem;
  font-size: 0.88rem;
  text-align: center;
}

/* ── Weather Card ── */
.weather-card {
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #ebe1e8;
  border-radius: 8px;
  padding: 1.5rem;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.city-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
  color: #333;
}
.date-text {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}
.weather-icon-big img {
  width: 70px;
  height: 70px;
}

/* ── Temp ── */
.temp-section {
  display: flex;
  align-items: flex-start;
  margin-top: 0.25rem;
}
.temp-value {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
  color: #333;
}
.temp-unit {
  font-size: 1.8rem;
  margin-top: 0.4rem;
  color: #888;
}
.weather-desc {
  color: #888;
  margin: 0.2rem 0 1.2rem;
  font-size: 0.95rem;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.stat-item {
  background: #f3eff2;
  border: 1px solid #ebe1e8;
  border-radius: 6px;
  padding: 0.75rem 0.4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.stat-icon { font-size: 1.2rem; }
.stat-value { font-size: 0.88rem; font-weight: 700; color: #333; }
.stat-label { font-size: 0.68rem; color: #888; }

/* ── Min/Max ── */
.minmax-bar {
  display: flex;
  justify-content: space-between;
  background: hsl(204, 45%, 74%);
  border: 1px solid hsl(204, 45%, 74%);
  border-radius: 6px;
  padding: 0.6rem 0.9rem;
  font-size: 0.88rem;
  color: #555;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  margin-top: 2.5rem;
  color: #aaa;
}
.empty-icon { font-size: 3rem; margin-bottom: 0.6rem; }

/* ── Transition ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 500px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .temp-value { font-size: 3rem; }
  .city-name { font-size: 1rem; }
}
</style>