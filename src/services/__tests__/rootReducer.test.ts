import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  // Основной тест: обработка неизвестного экшена
  it('should handle unknown action and return state', () => {
    // 1. Вызываем с undefined и неизвестным экшеном
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // 2. Проверяем что что-то возвращено
    expect(state).toBeDefined();
    
    // 3. Проверяем что это объект
    expect(typeof state).toBe('object');
    
    // 4. Проверяем ключевые слайсы 
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profileOrders');
    
    // 5. Проверяем начальное состояние ingredients
    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });
});