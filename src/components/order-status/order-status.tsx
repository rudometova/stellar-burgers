import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
  cancelled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';

  switch (status) {
    case 'pending':
      textStyle = '#E52B1A'; // Красный для "Готовится"
      break;
    case 'done':
      textStyle = '#00CCCC'; // Синий для "Выполнен"
      break;
    case 'cancelled':
      textStyle = '#E52B1A'; // Красный для "Отменён"
      break;
    default:
      textStyle = '#F2F2F3'; // Серый для остальных
  }

  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] || status} />
  );
};
