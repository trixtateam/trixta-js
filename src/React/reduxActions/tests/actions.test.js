import { updateTrixtaError } from '../index';
import { UPDATE_TRIXTA_ERROR } from '../../constants';

describe('Trixta redux Actions', () => {
  let expectedResult;
  let parameters;
  beforeEach(() => {
    expectedResult = {
      type: {},
    };
    parameters = {};
  });

  describe('common actions related', () => {
    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });

    describe('updateTrixtaError Action', () => {
      it('has a type of UPDATE_TRIXTA_ERROR', () => {
        parameters = {
          error: 'error',
        };
        expectedResult = {
          type: UPDATE_TRIXTA_ERROR,
          error: 'error',
        };
        expect(updateTrixtaError(parameters)).toEqual(expectedResult);
      });
    });
  });
});
