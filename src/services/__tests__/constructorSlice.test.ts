import {
  constructorReducer,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../slices/index';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const mockIngredient: TConstructorIngredient = {
  ...mockBun,
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  id: 'ingredient-1'
};

describe('constructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addBun', () => {
    it('should add bun to constructor', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);
      
      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('should replace existing bun when adding new one', () => {
      const firstBun = { ...mockBun, _id: 'bun1' };
      const secondBun = { ...mockBun, _id: 'bun2' };
      
      let state = constructorReducer(initialState, addBun(firstBun));
      state = constructorReducer(state, addBun(secondBun));
      
      expect(state.bun).toEqual(secondBun);
      expect(state.bun?._id).toBe('bun2');
    });
  });

  describe('addIngredient', () => {
    it('should add ingredient to constructor', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient);
    });

    it('should add multiple ingredients', () => {
      const ingredient1 = { ...mockIngredient, id: '1' };
      const ingredient2 = { ...mockIngredient, id: '2' };
      
      let state = constructorReducer(initialState, addIngredient(ingredient1));
      state = constructorReducer(state, addIngredient(ingredient2));
      
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('1');
      expect(state.ingredients[1].id).toBe('2');
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' },
          { ...mockIngredient, id: '3' }
        ]
      };
      
      const action = removeIngredient('2');
      const state = constructorReducer(stateWithIngredients, action);
      
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients.map(i => i.id)).toEqual(['1', '3']);
    });

    it('should do nothing if ingredient id not found', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: '1' }]
      };
      
      const action = removeIngredient('non-existent');
      const state = constructorReducer(stateWithIngredients, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('1');
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from dragIndex to hoverIndex', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1', name: 'Ingredient 1' },
          { ...mockIngredient, id: '2', name: 'Ingredient 2' },
          { ...mockIngredient, id: '3', name: 'Ingredient 3' },
          { ...mockIngredient, id: '4', name: 'Ingredient 4' }
        ]
      };
      
      const action = moveIngredient({ dragIndex: 1, hoverIndex: 3 });
      const state = constructorReducer(stateWithIngredients, action);
      
      expect(state.ingredients.map(i => i.id)).toEqual(['1', '3', '4', '2']);
    });

    it('should handle move to same position', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      };
      
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 0 });
      const state = constructorReducer(stateWithIngredients, action);
      
      expect(state.ingredients.map(i => i.id)).toEqual(['1', '2']);
    });
  });

  describe('clearConstructor', () => {
    it('should reset constructor to initial state', () => {
      const stateWithData = {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, id: '1' }]
      };
      
      const action = clearConstructor();
      const state = constructorReducer(stateWithData, action);
      
      expect(state).toEqual(initialState);
    });
  });
});