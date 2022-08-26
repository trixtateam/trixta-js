# Documentation
## Table of Contents
- [REACT](react)
  - [Actions](https://trixtateam.github.io/trixta-js/?path=/docs/common-redux-actions-connecttrixta--page)
  - [Components](https://trixtateam.github.io/trixta-js/?path=/docs/trixta-actions-components-trixtaactioncomponent--default)
  - [Hooks](https://trixtateam.github.io/trixta-js/?path=/docs/trixta-actions-hooks-usetrixtaaction--default)
  - [Redux](https://trixtateam.github.io/trixta-js/?path=/docs/trixta-redux-store-preview--trixta-state)
  - [Selectors](react/trixta/selectors.md)
  - [Sagas](react/trixta/sagas.md)

## Overview

### Quickstart
## Install

Install the package with npm or yarn

`npm i @trixtateam/trixta-js @trixtateam/phoenix-to-redux` or yarn - whichever you prefer

`yarn add @trixtateam/trixta-js @trixtateam/phoenix-to-redux`

## 1. Setup Reducer

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

## 2. Setup Middleware
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
  const middlewares = [sagaMiddleware,phoenixChannelMiddleWare];

  // Create the store with saga middleware
  const middlewares = [phoenixChannelMiddleWare];

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

## 3. Setup Trixta Saga
[See redux-saga](https://redux-saga.js.org/docs/introduction/GettingStarted)
### Option 1

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

### Option 2

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

## 4. Connect Trixta

#### Not logged In
```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { connectTrixta } from '@trixtateam/trixta-js';

export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: 'localhost:4000'}));
}

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
}
```

#### Logged In
```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { connectTrixta } from '@trixtateam/trixta-js';

export function* connectTrixtaSaga() {
  yield put(connectTrixta({ space: 'localhost:4000', params : { agentId: 'john@doe.com', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'  }}));
}

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield call(connectTrixtaSaga);
}
```
