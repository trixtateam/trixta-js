# Documentation
## Table of Contents
- [REACT](react)
  - [Actions](react/trixta/actions.md)
  - [Components](react/trixta/components.md)
  - [Redux](react/trixta/redux.md)
  - [Selectors](react/trixta/selectors.md)

## Overview

### Quickstart
## Install
Install the package with npm

```npm i @trixta/trixtajs```
or yarn - whichever you prefer

```yarn add @trixta/trixtajs```

## 1. Setup Reducer
```javascript
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { trixtaReducer } from '@trixta/trixtajs';
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
import { setupTrixtaSaga } from '@trixta/trixtajs';
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
import { put, select, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { setupTrixtaSaga } from '@trixta/trixtajs';

export default function* rootSaga() {
  yield all([setupTrixtaSaga()]);
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
import { put, select, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { updateTrixtaRoles } from '@trixta/trixtajs';
import {
  socketActionTypes,
} from '@trixta/phoenix-to-redux';


/**
 * After the socket is connected,
 * @param {*} params
 */
export function* socketConnectedSaga({ isAnonymous }) {
  // handle connection response
  const currentSession = yield select(makeSelectCurrentSession());
  // save roles in reducer or somewhere to passs to trixta action
  const roles = _.get(currentSession, 'roles', []);
  if (!isAnonymous && roles) {
    yield put(updateTrixtaRoles({ roles }));
  }
}

export default function* rootSaga() {
  yield all([setupTrixtaSaga()]);
  yield takeEvery(socketActionTypes.SOCKET_OPEN, socketConnectedSaga);
}
```
