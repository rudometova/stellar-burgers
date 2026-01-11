import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { getUser, getUserError } from '../../services/selectors';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(getUser);
  const error = useSelector(getUserError);
  const from = location.state?.from || { pathname: '/' };

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
    />
  );
};
