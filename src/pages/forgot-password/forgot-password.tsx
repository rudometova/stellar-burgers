import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        navigate('/reset-password', {
          state: { fromForgotPassword: true }
        });
      })
      .catch((error) => {
        console.error('Ошибка восстановления пароля:', error);
      });
  };

  return (
    <ForgotPasswordUI
      errorText=''
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
