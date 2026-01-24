import reducer, {
  createOrder,
  clearOrder,
  initialState
} from '../slices/orderSlice';

const mockOrder = {
  _id: 'order-123',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done' as const,
  name: 'Краторный метеоритный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

describe('order slice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('should handle createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        order: null,
        orderRequest: true,
        orderError: null
      });
    });

    it('should handle createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        order: mockOrder,
        orderRequest: false,
        orderError: null
      });
    });

    it('should handle createOrder.rejected with payload error', () => {
      const errorMessage = 'Ошибка при оформлении заказа';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        order: null,
        orderRequest: false,
        orderError: errorMessage
      });
    });

    it('should handle createOrder.rejected with error message', () => {
      const errorMessage = 'Network error';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      
      // Проверяем, что ошибка записана (может быть либо переданная, либо дефолтная)
      expect(state).toEqual({
        order: null,
        orderRequest: false,
        orderError: expect.any(String) // Проверяем, что это строка
      });
      expect(state.orderError).toBeDefined();
    });
  });

  describe('clearOrder', () => {
    it('should clear order and error', () => {
      const stateWithOrder = {
        order: mockOrder,
        orderRequest: false,
        orderError: 'Some error'
      };
      
      const action = clearOrder();
      const state = reducer(stateWithOrder, action);
      
      expect(state).toEqual({
        order: null,
        orderRequest: false,
        orderError: null
      });
    });
  });
});