import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/selectors';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// Явно объявляем тип пропсов
export const FeedInfo: FC<{
  feed: { total: number; totalToday: number };
}> = () => {
  const orders = useSelector(getFeedOrders);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
