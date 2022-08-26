<img src="https://raw.githubusercontent.com/trixtateam/trixta-js/master/docs/images/trixta-logo.png" alt="trixta logo"  />
JS
<hr />

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://trixtateam.github.io/trixta-js/)

![GitHub Release Date](https://img.shields.io/github/release-date/trixtateam/trixta-js)
![GitHub last commit](https://img.shields.io/github/last-commit/trixtateam/trixta-js)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/trixtateam/trixta-js)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/trixtateam/trixta-js/latest)

![Coverage statements](https://github.com/trixtateam/trixta-js/blob/master/badges/badge-statements.svg)
![Coverage branches](https://github.com/trixtateam/trixta-js/blob/master/badges/badge-branches.svg)
![Coverage functions](https://github.com/trixtateam/trixta-js/blob/master/badges/badge-functions.svg)
![Coverage lines](https://github.com/trixtateam/trixta-js/blob/master/badges/badge-lines.svg)

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
[Explore the documentation =>](https://trixtateam.github.io/trixta-js/)

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

## License

This project is licensed under the MIT license, Copyright (c) 2020 Trixta Inc.
For more information see `LICENSE.md`.
