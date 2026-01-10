import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { logoutUser } from '../../services/slices/userSlice';
import {
  getProfileOrders,
  getProfileOrdersLoading
} from '../../services/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrders);
  const isLoading = useSelector(getProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} onLogout={handleLogout} />;
};
