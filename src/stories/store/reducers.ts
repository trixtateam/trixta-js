import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixtateam/phoenix-to-redux';
import { trixtaReducer } from '../../main/React/reducers/trixtaReducer';

export function createReducer() {
  return combineReducers({
    phoenix: phoenixReducer,
    trixta: trixtaReducer,
  });
}
