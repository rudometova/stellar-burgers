import { FC, useState, useEffect, SyntheticEvent } from 'react';
import { ProfileUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser, logoutUser } from '../../services/slices/userSlice';
import { getUser, getUserError } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const updateUserError = useSelector(getUserError);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isFormChanged, setIsFormChanged] = useState(false);

  // Инициализируем форму данными пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверяем, изменилась ли форма
  useEffect(() => {
    if (user) {
      const changed =
        formValue.name !== user.name ||
        formValue.email !== user.email ||
        formValue.password !== '';
      setIsFormChanged(changed);
    }
  }, [formValue, user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      dispatch(updateUser(formValue));
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
    setIsFormChanged(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || ''}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
    />
  );
};
