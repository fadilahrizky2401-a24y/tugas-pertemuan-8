import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: '',
  }),
  actions: {
    login(username) {
      this.isAuthenticated = true;
      this.username = username;
    },
    logout() {
      this.isAuthenticated = false;
      this.username = '';
    },
  },
});