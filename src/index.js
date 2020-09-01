import { trixtaReducer } from './React/reducers';
import * as reduxActions from './React/reduxActions';
import * as utils from './utils';
import * as selectors from './React/selectors';
import * as constants from './React/constants';
import { setupTrixtaSaga } from './React/sagas';

module.exports = {
  trixtaReducer,
  setupTrixtaSaga,
  ...constants,
  ...selectors,
  ...reduxActions,
  ...utils,
};
