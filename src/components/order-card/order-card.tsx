import { FC, memo, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { getIngredients } from '../../services/selectors';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { pathname } = location;

  // Получаем все ингредиенты из хранилища
  const ingredients = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    // Определяем путь в зависимости от текущего маршрута
    let linkTo = '';
    if (pathname.startsWith('/feed')) {
      linkTo = `/feed/${order.number}`;
    } else if (pathname.startsWith('/profile/orders')) {
      linkTo = `/profile/orders/${order.number}`;
    }

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date,
      linkTo
    };
  }, [order, ingredients, pathname]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
