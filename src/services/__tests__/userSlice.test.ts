import reducer, {
  loginUser,
  registerUser,
  logoutUser,
  checkUserAuth,
  setAuthChecked,
  initialState
} from '../slices/userSlice';

const mockUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('user slice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('loginUser', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: true,
        error: null
      });
    });

    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: false,
        isLoading: false,
        error: null
      });
    });

    it('should handle loginUser.rejected', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('registerUser', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: true,
        error: null
      });
    });

    it('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: false,
        isLoading: false,
        error: null
      });
    });

    it('should handle registerUser.rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('logoutUser', () => {
    it('should handle logoutUser.pending', () => {
      const stateWithUser = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      };

      const action = { type: logoutUser.pending.type };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        isLoading: true,
        error: null
      });
    });

    it('should handle logoutUser.fulfilled', () => {
      const stateWithUser = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: true,
        error: null
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });

    it('should handle logoutUser.rejected', () => {
      const stateWithUser = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(stateWithUser, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('checkUserAuth', () => {
    it('should handle checkUserAuth.pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: false,
        isLoading: true,
        error: null
      });
    });

    it('should handle checkUserAuth.fulfilled with user', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });

    it('should handle checkUserAuth.fulfilled without user', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: null
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });

    it('should handle checkUserAuth.rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });
  });

  describe('setAuthChecked', () => {
    it('should set auth checked state', () => {
      const action = setAuthChecked(true);
      const state = reducer(initialState, action);

      expect(state).toEqual({
        user: null,
        isAuthChecked: true,
        isLoading: false,
        error: null
      });
    });
  });
});
