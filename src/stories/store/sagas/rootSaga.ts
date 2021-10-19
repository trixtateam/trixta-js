import {
  connectPhoenix,
  getPhoenixChannel,
  socketActionTypes,
} from '@trixta/phoenix-to-redux';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { setupTrixtaSaga } from '../../..';
import { getChannelName } from '../../../utils/trixta';
import { DEFAULT_TRIXTA_ROLE, DEFAULT_TRIXTA_SPACE } from '../../constants/trixta';

export function* connectTrixtaSaga() {
  yield put(
    connectPhoenix({ domainUrl: DEFAULT_TRIXTA_SPACE, params: {} }),
  );
}

export function* socketConnectedSaga() {
  const channelTopic = getChannelName({ role: DEFAULT_TRIXTA_ROLE });
  yield put(getPhoenixChannel({ channelTopic }));
}

export function* rootSaga() {
  yield call(connectTrixtaSaga);
  yield fork(setupTrixtaSaga);
  yield takeEvery(socketActionTypes.SOCKET_OPEN, socketConnectedSaga);
}
