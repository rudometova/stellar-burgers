import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import {
  getFeedOrders,
  getFeedLoading,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const isLoading = useSelector(getFeedLoading);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeeds())}
      total={total}
      totalToday={totalToday}
    />
  );
};
