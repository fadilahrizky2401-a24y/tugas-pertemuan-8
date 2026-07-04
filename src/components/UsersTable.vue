<template>
  <section class="users-table">
    <div class="table-header">
      <div>
        <h3>Users</h3>
        <p v-if="!isLoading && !errorMessage">
          {{ pagination.total }} user terdaftar
        </p>
      </div>

      <button type="button" class="refresh-button" :disabled="isLoading" @click="fetchUsers">
        Refresh
      </button>
    </div>

    <p v-if="isLoading" class="status-message">Memuat data users...</p>
    <p v-else-if="errorMessage" class="status-message error">{{ errorMessage }}</p>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="4" class="empty-state">Belum ada user.</td>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button type="button" :disabled="pagination.page <= 1 || isLoading" @click="changePage(pagination.page - 1)">
        Prev
      </button>
      <span>Halaman {{ pagination.page }} dari {{ totalPages }}</span>
      <button type="button" :disabled="pagination.page >= totalPages || isLoading" @click="changePage(pagination.page + 1)">
        Next
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const API_BASE_URL = 'http://localhost:3002/api';

const users = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
  totalPages: 1,
});

const totalPages = computed(() => Math.max(pagination.value.totalPages || 1, 1));

const fetchUsers = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const params = new URLSearchParams({
      page: String(pagination.value.page),
      perPage: String(pagination.value.perPage),
    });
    const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      errorMessage.value = result.message || 'Gagal memuat data users.';
      return;
    }

    users.value = result.users || [];
    pagination.value = {
      page: result.pagination?.page || 1,
      perPage: result.pagination?.perPage || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 1,
    };
  } catch (_error) {
    errorMessage.value = 'Backend belum berjalan atau terjadi kesalahan jaringan.';
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  fetchUsers();
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

onMounted(fetchUsers);
</script>

<style scoped>
.users-table {
  margin-top: 1.5rem;
  text-align: left;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

h3 {
  margin: 0 0 0.25rem;
}

p {
  margin: 0;
}

.refresh-button,
.pagination button {
  padding: 0.55rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: #fff;
  cursor: pointer;
}

.refresh-button:disabled,
.pagination button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

th {
  background-color: #f1f5f9;
  color: #2d3748;
  font-weight: 700;
}

tbody tr:last-child td {
  border-bottom: none;
}

.status-message {
  padding: 1rem;
  border-radius: 6px;
  background-color: #edf2f7;
  text-align: center;
}

.error {
  background-color: #fed7d7;
  color: #9b2c2c;
}

.empty-state {
  text-align: center;
  color: #718096;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.pagination span {
  color: #4a5568;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .table-header,
  .pagination {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>