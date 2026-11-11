import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  error: string | null;
}

// По требованию Скриншота 9: при обновлении F5 состояние Redux должно быть состоянием гостя (isAuthenticated: false),
// при этом cookie / localStorage сохраняют session_id для проверки через DevTools Application и Postman.
const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ username: string }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.loading = false;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.loading = false;
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAuthLoading, loginSuccess, logoutSuccess, setAuthError } = authSlice.actions;
export default authSlice.reducer;
