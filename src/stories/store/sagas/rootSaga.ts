import { call, fork, put } from 'redux-saga/effects';
import { connectTrixta, setupTrixtaSaga } from '../../..';
import { DEFAULT_TRIXTA_SPACE } from '../../constants/trixta';

export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: DEFAULT_TRIXTA_SPACE, params: {} }));
}

export function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
}
