import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderError: string | null;
};

export const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderError: null
};

// Thunk для оформления заказа с очисткой конструктора
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { dispatch, rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);

      // Импортируем action очистки конструктора
      // Если import вызывает циклическую зависимость, используем динамический импорт
      const { clearConstructor } = await import('./constructorSlice');

      // Очищаем конструктор после успешного создания заказа
      dispatch(clearConstructor());

      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при оформлении заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError =
          (action.payload as string) || 'Ошибка при оформлении заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
