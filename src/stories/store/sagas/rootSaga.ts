import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { connectTrixta, LOGIN_TRIXTA_SUCCESS, setupTrixtaSaga } from '../../..';
import { DEFAULT_TRIXTA_SPACE } from '../../constants/trixta';
export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: DEFAULT_TRIXTA_SPACE, params: {} }));
}

export function* loginSuccessSaga() {
  addons.getChannel().emit(FORCE_RE_RENDER);
}

export function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
  yield takeLatest(LOGIN_TRIXTA_SUCCESS,loginSuccessSaga)
}
