import { Location } from 'react-router-dom';
import { TIngredient, TOrder } from '@utils-types';

export type OrderCardUIProps = {
  orderInfo: TOrderInfo;
  maxIngredients: number;
  locationState: { background: Location };
};

export type TOrderInfo = TOrder & {
  ingredientsInfo: TIngredient[];
  ingredientsToShow: TIngredient[];
  remains: number;
  total: number;
  date: Date;
  linkTo: string;
};
