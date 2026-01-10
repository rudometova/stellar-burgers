import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { resetPassword } from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, что пользователь пришел с страницы forgot-password
  useEffect(() => {
    if (!location.state?.fromForgotPassword) {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ошибка сброса пароля:', error);
      });
  };

  return (
    <ResetPasswordUI
      errorText=''
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      token={token}
      setToken={setToken}
    />
  );
};
