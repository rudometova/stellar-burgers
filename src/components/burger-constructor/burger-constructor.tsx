import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  getConstructorBun,
  getConstructorIngredients,
  getTotalPrice,
  getOrder,
  getOrderRequest,
  getUser
} from '../../services/selectors';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const price = useSelector(getTotalPrice);
  const order = useSelector(getOrder);
  const orderRequest = useSelector(getOrderRequest);
  const user = useSelector(getUser);

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверяем авторизацию
    if (!user) {
      navigate('/login');
      return;
    }

    // Собираем массив ID ингредиентов
    const ingredientIds: string[] = [];

    if (bun) {
      ingredientIds.push(bun._id);
    }

    ingredients.forEach((ingredient) => {
      ingredientIds.push(ingredient._id);
    });

    if (bun) {
      ingredientIds.push(bun._id);
    }

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    if (order) {
      dispatch(clearConstructor());
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
