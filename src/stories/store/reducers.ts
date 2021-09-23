import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixta/phoenix-to-redux';
import { trixtaReducer } from '../../React/reducers/trixtaReducer';

export function createReducer() {
  return combineReducers({
    phoenix: phoenixReducer,
    trixta: trixtaReducer,
  });
}
