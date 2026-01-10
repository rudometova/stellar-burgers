import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedLoading
} from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);
  const isLoading = useSelector(getFeedLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
      total={total}
      totalToday={totalToday}
    />
  );
};
