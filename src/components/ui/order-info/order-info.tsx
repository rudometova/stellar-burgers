import { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return styles.status; // Используем класс .status из CSS (который задает #00cccc)
      case 'pending':
        return ''; // Для pending не задаем особый класс
      case 'created':
        return '';
      case 'cancelled':
        return '';
      default:
        return '';
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      case 'cancelled':
        return 'Отменён';
      default:
        return status;
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Номер заказа - используем класс .number из CSS */}
      <div className={`text text_type_digits-default ${styles.number} mb-10`}>
        #{orderInfo.number}
      </div>

      {/* Название бургера */}
      <h3 className={`text text_type_main-medium ${styles.header} mb-3`}>
        {orderInfo.name}
      </h3>

      {/* Статус заказа - используем getStatusColor для применения правильного класса */}
      <div
        className={`text text_type_main-default mb-15 ${getStatusColor(orderInfo.status)}`}
      >
        {getStatusText(orderInfo.status)}
      </div>

      {/* Состав заказа */}
      <p className={`text text_type_main-medium mb-6`}>Состав:</p>

      {/* Список ингредиентов */}
      <ul className={`${styles.list} mb-8`}>
        {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
          <li className={styles.item} key={index}>
            <div className={styles.img_wrap}>
              <div className={styles.border}>
                <img
                  className={styles.img}
                  src={item.image_mobile}
                  alt={item.name}
                />
              </div>
            </div>
            <span className='text text_type_main-default ml-4'>
              {item.name}
            </span>
            <span
              className={`text text_type_digits-default ml-auto mr-4 ${styles.quantity}`}
            >
              {item.count} x {item.price}
            </span>
            <CurrencyIcon type={'primary'} />
          </li>
        ))}
      </ul>

      {/* Дата и общая сумма */}
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={orderInfo.date} />
        </p>
        <span className={`text text_type_digits-default mr-2 ${styles.total}`}>
          {orderInfo.total}
        </span>
        <CurrencyIcon type={'primary'} />
      </div>
    </div>
  );
});
