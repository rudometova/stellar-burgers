import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  getConstructorBun,
  getConstructorIngredients,
  getTotalPrice
} from '../../services/selectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const price = useSelector(getTotalPrice);

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredients || []
  };

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: реализовать оформление заказа
  };

  const closeOrderModal = () => {};

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
