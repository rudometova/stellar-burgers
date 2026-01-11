import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        // Генерируем уникальный ID для ингредиента перед отправкой
        const ingredientWithId: TConstructorIngredient = {
          ...ingredient,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };

        dispatch(addIngredient(ingredientWithId));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
