import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser, getIsAuthChecked } from '../../services/selectors';
import { checkUserAuth } from '../../services/slices/userSlice';
import { Preloader } from '../../components/ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // Пользователь авторизован, но маршрут предназначен только для неавторизованных
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    // Пользователь неавторизован, но маршрут защищен
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
