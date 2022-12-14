import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixtateam/phoenix-to-redux';
import { trixtaReducer } from '@trixtateam/trixta-js-core';

export function createReducer() {
  return combineReducers({
    phoenix: phoenixReducer,
    trixta: trixtaReducer,
  });
}
