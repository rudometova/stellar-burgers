import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Используем PayloadAction<TIngredient> для добавления булки
    addBun: (state, action: PayloadAction<TIngredient>) => ({
      ...state,
      bun: action.payload
    }),

    // Используем PayloadAction<TConstructorIngredient> - ID должен быть сгенерирован заранее
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const currentIngredients = state.ingredients || [];
      return {
        ...state,
        ingredients: [...currentIngredients, action.payload]
      };
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const currentIngredients = state.ingredients || [];
      return {
        ...state,
        ingredients: currentIngredients.filter(
          (item) => item.id !== action.payload
        )
      };
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const currentIngredients = state.ingredients || [];
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = currentIngredients[dragIndex];

      const newIngredients = [...currentIngredients];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);

      return {
        ...state,
        ingredients: newIngredients
      };
    },

    clearConstructor: () => initialState
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
