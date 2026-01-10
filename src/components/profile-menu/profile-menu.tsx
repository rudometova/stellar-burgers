import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

type TProfileMenuProps = {
  onLogout?: () => void;
};

export const ProfileMenu: FC<TProfileMenuProps> = ({ onLogout }) => {
  const { pathname } = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
