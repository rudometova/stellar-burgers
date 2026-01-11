import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getIngredients } from '../../services/selectors';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ingredients = useSelector(getIngredients);

  useEffect(() => {
    if (number) {
      setIsLoading(true);
      setError(null);
      getOrderByNumberApi(parseInt(number))
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            setOrderData(response.orders[0]);
          } else {
            setError('Заказ не найден');
          }
        })
        .catch((err) => {
          setError(err.message || 'Ошибка при загрузке заказа');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error || !orderInfo) {
    return (
      <div className='text text_type_main-default p-10'>
        {error || 'Заказ не найден'}
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
