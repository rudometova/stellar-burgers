import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Базовые селекторы для доступа к частям состояния
const selectIngredientsState = (state: RootState) => state.ingredients;
const selectConstructorState = (state: RootState) => state.constructor;

// Селекторы для ингредиентов
export const getIngredients = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.ingredients || []
);

export const getIngredientsLoading = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.isLoading
);

export const getIngredientsError = createSelector(
  [selectIngredientsState],
  (ingredientsState) => ingredientsState.error
);

// Селекторы для конструктора
export const getConstructorBun = createSelector(
  [selectConstructorState],
  (constructorState) => constructorState.bun
);

export const getConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructorState) => constructorState.ingredients || []
);

// Селекторы для фильтрации ингредиентов по типу
export const getBuns = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'bun')
);

export const getMains = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'main')
);

export const getSauces = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'sauce')
);

// Селектор для подсчета количества каждого ингредиента в конструкторе
export const getIngredientCounts = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, constructorIngredients) => {
    const counts: { [key: string]: number } = {};

    // Считаем булку (если есть)
    if (bun) {
      counts[bun._id] = 2; // Булки всегда 2 (верхняя и нижняя)
    }

    // Считаем начинки и соусы
    constructorIngredients.forEach((ingredient) => {
      const id = ingredient._id;
      counts[id] = (counts[id] || 0) + 1;
    });

    return counts;
  }
);

// Селектор для расчета общей стоимости
export const getTotalPrice = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, ingredient: TIngredient) => total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);

// Селекторы для заказов
const selectOrderState = (state: RootState) => state.order;

export const getOrder = createSelector(
  [selectOrderState],
  (orderState) => orderState.order
);

export const getOrderRequest = createSelector(
  [selectOrderState],
  (orderState) => orderState.orderRequest
);

export const getOrderError = createSelector(
  [selectOrderState],
  (orderState) => orderState.orderError
);

// Селекторы для пользователя
const selectUserState = (state: RootState) => state.user;

export const getUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);

export const getIsAuthChecked = createSelector(
  [selectUserState],
  (userState) => userState.isAuthChecked
);

export const getUserLoading = createSelector(
  [selectUserState],
  (userState) => userState.isLoading
);

export const getUserError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

// Селекторы для ленты заказов
const selectFeedState = (state: RootState) => state.feed;

export const getFeedOrders = createSelector(
  [selectFeedState],
  (feedState) => feedState.orders
);

export const getFeedTotal = createSelector(
  [selectFeedState],
  (feedState) => feedState.total
);

export const getFeedTotalToday = createSelector(
  [selectFeedState],
  (feedState) => feedState.totalToday
);

export const getFeedLoading = createSelector(
  [selectFeedState],
  (feedState) => feedState.isLoading
);

export const getFeedError = createSelector(
  [selectFeedState],
  (feedState) => feedState.error
);

// Селекторы для истории заказов
const selectProfileOrdersState = (state: RootState) => state.profileOrders;

export const getProfileOrders = createSelector(
  [selectProfileOrdersState],
  (profileOrdersState) => profileOrdersState.orders
);

export const getProfileOrdersLoading = createSelector(
  [selectProfileOrdersState],
  (profileOrdersState) => profileOrdersState.isLoading
);

export const getProfileOrdersError = createSelector(
  [selectProfileOrdersState],
  (profileOrdersState) => profileOrdersState.error
);
