## Saga Helpers

### listenForTrixtaReactionResponse action

```javascript
import {
  fork,
  ForkEffect,
  put,
  PutEffect,
  takeEvery,
} from 'redux-saga/effects';
import { listenForTrixtaReactionResponse } from '@trixta/trixta-js';

/**
 * Listen for Trixta reaction for params.meta.roleName and params.meta.reactionName
 * @param {Object} params
 * @param {Object} params.meta
 * @param {String} params.meta.roleName - name of Trixta role
 * @param {String} params.meta.reactionName - name of Trixta reaction
 * @param {Object} params.reactionDetails - Trixta reaction response
 */
export default function* checkReactionSaga({meta, reactionDetails}) {
  if(meta.reactionName === 'name of Trixta reaction'){
    yield put({type:'EXAMPLE',data: reactionDetails.initial_data });
  }
}


export default function* globalSaga() {
yield takeEvery(listenForTrixtaReactionResponse({
  roleName: // name of Trixta role
  reactionName: // name of Trixta reaction
}),checkReactionSaga);
}

```

### respondToTrixtaReactionEffectSaga

[`respondToTrixtaReactionEffectSaga`](https://github.com/trixtateam/trixtaJS/blob/master/src/React/sagas/respondToTrixtaReactionEffectSaga.js) - allows to respond to Trixta reactions in sagas

#### example

```javascript
export const EXAMPLE_RESPONSE = 'app/EXAMPLE_RESPONSE';

export const getResponse(response) => ({
  type: EXAMPLE_RESPONSE,
  data: response,
})
```

```javascript
import {getResponse} from './actions'
import {
  fork,
  ForkEffect,
  put,
  PutEffect,
  takeLatest,
} from 'redux-saga/effects';
import { respondToTrixtaReactionEffectSaga } from '@trixta/trixta-js';


export default function* globalSaga() {
yield fork(respondToTrixtaReactionEffectSaga,{
  roleName: // name of Trixta role
  reactionName: // name of Trixta reaction
  actionToDispatch: getResponse
});
}

```

OR

```javascript
import {EXAMPLE_RESPONSE} from './actions'
import {
  fork,
  ForkEffect,
  put,
  PutEffect,
  takeLatest,
} from 'redux-saga/effects';
import { respondToTrixtaReactionEffectSaga } from '@trixta/trixta-js';


export default function* globalSaga() {
yield fork(respondToTrixtaReactionEffectSaga,{
  roleName: // name of Trixta role
  reactionName: // name of Trixta reaction
  dispatchResponseTo: EXAMPLE_RESPONSE
});
}

```
