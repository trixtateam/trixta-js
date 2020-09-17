import { trixtaReducer, initialState } from '../trixtaReducer';

describe('Trixta Reducers', () => {
  describe('trixtaReducer', () => {
    it('returns the initial state', () => {
      expect(trixtaReducer(undefined, {})).toEqual(initialState);
    });
  });
});
