## Quickstart Guide
### 1. Install
```shell
yarn add @trixtateam/trixta-js @trixtateam/phoenix-to-redux
```
### 2. Setup Reducer

```javascript
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixtateam/phoenix-to-redux';
import { trixtaReducer } from '@trixtateam/trixta-js';
export default function createReducer() {
  const rootReducer = combineReducers({
    trixta: trixtaReducer,
    phoenix: phoenixReducer,
  });
  return rootReducer;
}
```

### 3. Setup Middleware
[See example to setup middleware](https://redux-toolkit.js.org/api/configureStore)

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createPhoenixChannelMiddleware } from '@trixtateam/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';

export default function configureStore() {
  const reduxSagaMonitorOptions = {};
  // Makes redux connected to phoenix channels
  const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  // Create the store with saga middleware
  const middlewares = [sagaMiddleware,phoenixChannelMiddleWare];

   const enhancers = [];

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
      process.env.NODE_ENV !== 'production' ||
      process.env.PUBLIC_URL.length > 0,
    enhancers,
  });

   return store;
}
```

### 4. Setup Trixta Saga
[See redux-saga](https://redux-saga.js.org/docs/introduction/GettingStarted)

#### Option 1

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createPhoenixChannelMiddleware } from '@trixtateam/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import { setupTrixtaSaga } from '@trixtateam/trixta-js';
import createReducer from './reducers';

export default function configureStore() {
  const reduxSagaMonitorOptions = {};
  // Makes redux connected to phoenix channels
  const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware,phoenixChannelMiddleWare];

  const enhancers = [];

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
      process.env.NODE_ENV !== 'production' ||
      process.env.PUBLIC_URL.length > 0,
    enhancers,
  });

  sagaMiddleware.run(setupTrixtaSaga);

  return store;
}
```

#### Option 2

```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { setupTrixtaSaga } from '@trixtateam/trixta-js';

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
}
```

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createPhoenixChannelMiddleware } from '@trixtateam/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import createReducer from './reducers';

export default function configureStore() {
   const reduxSagaMonitorOptions = {};
  // Makes redux connected to phoenix channels
  const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware,phoenixChannelMiddleWare];

  const enhancers = [];

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
      process.env.NODE_ENV !== 'production' ||
      process.env.PUBLIC_URL.length > 0,
    enhancers,
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
```

### 5. Connect Trixta
#### Option 1
#### Using useTrixtaSpace hook
```javascript
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useTrixtaSpace } from '@trixtateam/trixta-js';
import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
export function App() {
  useTrixtaSpace({ space: 'trixta-demo.space.trixta.io', params: {}});
return (
    <BrowserRouter>
      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}

```
or
#### Option 2
#### Using Saga
##### Not logged In
```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { connectTrixta } from '@trixtateam/trixta-js';

export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: 'trixta-demo.space.trixta.io'}));
}

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
}
```

##### Logged In
```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { connectTrixta } from '@trixtateam/trixta-js';

export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: 'trixta-demo.space.trixta.io', params : { agentId: 'john@doe.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'  }}));
}

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
}
```
