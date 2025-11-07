import { createSlice } from '@reduxjs/toolkit';

// Get inititoken and user from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        token: token,
        user: user,
      };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return {
    isAuthenticated: false,
    token: null,
    user: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // After Login set token and user
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    // After Logout clear state and localStorage
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    // Update user data
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

// Export actions
export const { login, logout, updateUser } = authSlice.actions;

// Export selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';

// Export reducer
export default authSlice.reducer;

