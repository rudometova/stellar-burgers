import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Thunk для получения истории заказов пользователя
export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setProfileOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке истории заказов';
      });
  }
});

export const { setProfileOrders, clearProfileOrders } =
  profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
