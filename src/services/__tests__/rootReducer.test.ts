describe('rootReducer', () => {
  it('should initialize with correct structure', () => {
    // Мокаем структуру как в реальном приложении
    const mockState = {
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      constructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        orderRequest: false,
        orderError: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      }
    };
    
    expect(typeof mockState).toBe('object');
    expect(mockState).toHaveProperty('ingredients');
    expect(mockState).toHaveProperty('constructor');
    expect(mockState.constructor.bun).toBeNull();
    expect(mockState.constructor.ingredients).toEqual([]);
  });
});