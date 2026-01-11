import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import {
  getConstructorBun,
  getConstructorIngredients
} from '../../services/selectors';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем данные из хранилища
  const bun = useSelector(getConstructorBun);
  const constructorIngredients = useSelector(getConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Считаем начинки и соусы
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Считаем булку (если есть)
    if (bun) {
      counters[bun._id] = 2; // Булки всегда 2 (верхняя и нижняя)
    }

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
