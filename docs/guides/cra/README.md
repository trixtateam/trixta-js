## Setting up Trixta-js with CRA

### 1. Setup Template
```shell
yarn create react-app --template cra-template-rb my-example app
```

```shell
cd my-example-app
```
### 2. Install trixta-js
```shell
yarn add @trixtateam/trixta-js @trixtateam/phoenix-to-redux
```

### 3. Generate Login Page Example
```shell
yarn generate
```
Follow the prompt instructions and create component under Pages directory

Replace file contents with below code.
```src\app\pages\LoginPage```
```javascript
/**
 *
 * LoginPage
 *
 */
import {
  ReservedTrixtaRoles,
  TrixtaActionComponent,
  TrixtaLoginWidget,
  TrixtaReactionComponent,
} from '@trixtateam/trixta-js';
import { PageWrapper } from '../../components/PageWrapper';

interface Props {}

export function LoginPage(props: Props) {
  return (
    <PageWrapper>
    <div
        style={{
          margin: '10px',
          padding: '10px',
          backgroundColor: '#dce6ea',
        }}
      >
        <TrixtaLoginWidget />
      </div>
      <div
        style={{
          margin: '10px',
          padding: '10px',
        }}
      >
        <TrixtaActionComponent
          actionName="example"
          roleName={ReservedTrixtaRoles.EVERYONE_AUTHED}
        />
      </div>
      <div
        style={{
          margin: '10px',
          padding: '10px',
        }}
      >
        <TrixtaReactionComponent
          reactionName="welcome"
          requestForEffect
          roleName={ReservedTrixtaRoles.EVERYONE_AUTHED}
        />
      </div>
    </PageWrapper>
  );
}
```

### 4. Setup Reducer
Replace file contents with below code.

```src\store\reducers.ts```

```javascript
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { phoenixReducer } from '@trixtateam/phoenix-to-redux';
import { trixtaReducer } from '@trixtateam/trixta-js';
import { InjectedReducersType } from 'utils/types/injector-typings';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return state => state;
  } else {
    return combineReducers({
      trixta: trixtaReducer,
      phoenix: phoenixReducer,
      ...injectedReducers,
    });
  }
}
```

### 5. Setup Trixta Saga
Create and copy saga file
```src\app\sagas\app.ts```

```javascript
import { setupTrixtaSaga } from '@trixtateam/trixta-js';
import { fork } from 'redux-saga/effects';

export default function* rootSaga() {
  yield fork(setupTrixtaSaga);
}
```

### 6. Configure Store
Replace file contents with below code.

```src\store\configureStore.ts```

```javascript
import {
  configureStore,
  getDefaultMiddleware,
  StoreEnhancer,
} from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';

import { createPhoenixChannelMiddleware } from '@trixtateam/phoenix-to-redux';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  // Makes redux connected to phoenix channels
  const phoenixChannelMiddleWare = createPhoenixChannelMiddleware();
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware, phoenixChannelMiddleWare];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

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

### 7. Connect Trixta
Replace file contents with below code.

```src\app\index.tsx```

```javascript
/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GlobalStyle } from '../styles/global-styles';
import { useTrixtaSpace } from '@trixtateam/trixta-js';
import { useTranslation } from 'react-i18next';
import { SagaInjectionModes, useInjectSaga } from 'redux-injectors';
import { HomePage } from './pages/HomePage/Loadable';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import saga from './sagas/app';
export function App() {
  useInjectSaga({ key: 'App', saga, mode: SagaInjectionModes.DAEMON });
  useTrixtaSpace({ space: 'trixta-demo.space.trixta.io', params: {} });
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/login'}
          component={LoginPage}
        />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
```

### 8. Run Example
```shell
yarn start
```

- Select the light theme
- Navigate to http://localhost:3000/login
- Follow the prompts and see what happens.
