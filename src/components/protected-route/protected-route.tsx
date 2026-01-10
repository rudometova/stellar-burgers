import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  // Временная заглушка - пока нет стора с пользователем
  const user = useSelector((state: any) => state.user?.user || null);
  const location = useLocation();

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
