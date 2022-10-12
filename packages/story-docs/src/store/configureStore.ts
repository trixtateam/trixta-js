import {
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { createPhoenixChannelMiddleware } from '@trixtateam/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';
import { rootSaga } from './sagas/rootSaga';
export function configureAppStore(): EnhancedStore {
  const reduxSagaMonitorOptions = {};
  // Makes redux connected to phoenix channels
  const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware, phoenixChannelMiddleWare];
  const store = configureStore({
    reducer: createReducer(),
    middleware: [
      ...getDefaultMiddleware({
        thunk: false,
        immutableCheck: {
          ignore: ['socket', 'channel', 'trixta', 'phoenix', 'router'],
        },
        serializableCheck: false,
      }),
      ...middlewares,
    ],
    devTools:
      /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production',
  });

  sagaMiddleware.run(rootSaga);

  return store;
}

const store = configureAppStore();
export type AppDispatch = typeof store.dispatch;

export default store;
