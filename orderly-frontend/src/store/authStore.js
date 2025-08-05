import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/axiosConfig'; // Import the API client

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },
      // Make the logout function async to handle the API call
      logout: async () => {
        try {
          // Call the backend logout endpoint
          await apiClient.post('/employees/logout');
        } catch (error) {
          // Even if the API call fails (e.g., network error, expired token),
          // we still want to log the user out on the frontend.
          console.error("Logout API call failed, logging out locally.", error);
        } finally {
          // Clear the state and local storage regardless of API call success
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;