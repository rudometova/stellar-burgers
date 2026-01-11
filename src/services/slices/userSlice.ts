import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// Проверка пользователя
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        return response.user;
      } catch (error) {
        // Если токен невалиден, сбрасываем авторизацию
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
      }
    }
    return null;
  }
);

// Вход
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    const accessToken = response.accessToken.startsWith('Bearer ')
      ? response.accessToken.split('Bearer ')[1]
      : response.accessToken;
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: { email: string; password: string; name: string }) => {
    const response = await registerUserApi(data);
    const accessToken = response.accessToken.startsWith('Bearer ')
      ? response.accessToken.split('Bearer ')[1]
      : response.accessToken;
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// Выход
export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } catch (error) {
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return null;
});

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: { email?: string; name?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

// Восстановление пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

// Сброс пароля
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
        state.user = null;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка восстановления пароля';
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка сброса пароля';
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
