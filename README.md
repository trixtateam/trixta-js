<img src="./docs/images/trixta-logo.png" alt="trixta logo"  />
JS
<br />

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
  trixta-js a javascript library to help any organization, easily connect to a Trixta space, build front-end components for you application. It leverages 
  [phoenix-to-redux](https://github.com/trixtateam/phoenix-to-redux) to communicate with Trixta and gives you a variety of tools / utilities to build react components.
  
# Who is this for?
  Any orgranization using Trixta for their javascript application.

# Quick Start Guide
## Install
Install the package with npm

```npm i @trixta/trixta-js```
or yarn - whichever you prefer

```yarn add @trixta/trixta-js```

## 1. Setup Reducer
```javascript
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { trixtaReducer } from '@trixta/trixta-js';
import { phoenixReducer } from '@trixta/phoenix-to-redux';
export default function createReducer() {
  const rootReducer = combineReducers({
    trixta: trixtaReducer,
    phoenix: phoenixReducer,
  });
  return rootReducer;
}
```

## 2. Setup Middleware
```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
import createReducer from './reducers';

const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  // 1. phoenixChannelMiddleWare: Makes redux connected to phoenix channels
  const middlewares = [
    phoenixChannelMiddleWare,
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer());
    });
  }

  return store;
}
```
## 3. Setup Trixta Saga
### Option 1
```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
import { setupTrixtaSaga } from '@trixta/trixta-js';
import createReducer from './reducers';

const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  // 1. phoenixChannelMiddleWare: Makes redux connected to phoenix channels
  const middlewares = [
    phoenixChannelMiddleWare,
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

   sagaMiddleware.run(setupTrixtaSaga)

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer());
    });
  }

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
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createPhoenixChannelMiddleware } from '@trixta/phoenix-to-redux';
import rootSaga from './rootSaga';
import createReducer from './reducers';

const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  // 1. phoenixChannelMiddleWare: Makes redux connected to phoenix channels
  const middlewares = [
    phoenixChannelMiddleWare,
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

   sagaMiddleware.run(rootSaga)

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer());
    });
  }

  return store;
}
```

## 4. Setup Trixta Roles
```javascript
import { put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { updateTrixtaRoles } from '@trixta/trixta-js';
import {
  socketActionTypes,
} from '@trixta/phoenix-to-redux';


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

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
  yield takeEvery(socketActionTypes.SOCKET_OPEN, socketConnectedSaga);
}
```

## Documentation
- [**The detailed Guide to `trixta-js`**](docs/README.md)

## License

This project is licensed under the MIT license, Copyright (c) 2020 Trixta Inc. For more information see `LICENSE.md`.
