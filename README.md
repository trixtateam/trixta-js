<img src="./docs/images/trixta-logo.png" alt="trixta logo"  />
JS
<hr />

![GitHub Release Date](https://img.shields.io/github/release-date/trixtateam/trixta-js?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/trixtateam/trixta-js?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/trixtateam/trixta-js?style=for-the-badge)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/trixtateam/trixta-js/latest?style=for-the-badge)

![Coverage statements](badges/badge-statements.svg)
![Coverage branches](badges/badge-branches.svg)
![Coverage functions](badges/badge-functions.svg)
![Coverage lines](badges/badge-lines.svg)

<br />

# What is trixta-JS?

trixta-js a javascript library to help any organization, easily connect to a
Trixta space, build front-end components for you application. It leverages
[phoenix-to-redux](https://github.com/trixtateam/phoenix-to-redux) to
communicate with Trixta and gives you a variety of tools / utilities to build
react components.

# Who is this for?

Any orgranization using Trixta for their javascript application.

# Quick Start Guide

## Install

Install the package with npm

`npm i @trixta/trixta-js` or yarn - whichever you prefer

`yarn add @trixta/trixta-js`

## 1. Setup Reducer

```javascript
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixta/phoenix-to-redux';
import { trixtaReducer } from '@trixta/trixta-js';
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
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
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
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import { setupTrixtaSaga } from '@trixta/trixta-js';
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
import { setupTrixtaSaga } from '@trixta/trixta-js';

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
}
```

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
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

## 4. Setup Trixta Roles

```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { updateTrixtaRoles } from '@trixta/trixta-js';
import { socketActionTypes,connectPhoenix } from '@trixta/phoenix-to-redux';

/**
 * After the socket is connected,
 * @param {*} params
 */
export function* socketConnectedSaga() {
  // handle connection response
  const currentSession = yield select(makeSelectCurrentSession());
  // save roles in reducer or somewhere to passs to trixta-js action
  const roles = currentSession.roles.map((role) => ({
    name: role,
    logPresence: false,
  }));
  if (roles) {
    yield put(updateTrixtaRoles({ roles }));
  }
}

export function* connectPhoenixSaga() {
  yield put(connectPhoenix({ domainUrl: 'localhost:4000', params : {  }));
}

export default function* rootSaga() {
  yield call(connectPhoenixSaga);
  yield fork(setupTrixtaSaga);
  yield takeEvery(socketActionTypes.SOCKET_OPEN, socketConnectedSaga);
}
```

## Change Log

- [Changes](CHANGELOG.md)

## Documentation

- [**The detailed Guide to `trixta-js`**](docs/README.md)

## License

This project is licensed under the MIT license, Copyright (c) 2020 Trixta Inc.
For more information see `LICENSE.md`.
