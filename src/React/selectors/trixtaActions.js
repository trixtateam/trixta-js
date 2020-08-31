import { createSelector } from 'reselect';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import { getReducerKeyName } from '../../utils';

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionForRole = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })];

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionResponseInstancesForRole = (state, props) =>
  get(
    state.trixta.actions,
    `${getReducerKeyName({
      name: props.actionName,
      role: props.roleName,
    })}.instances`,
    []
  );

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {String} props.instanceIndex - index for action instance
 */
const selectActionResponseInstance = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })]
    .instances[props.instanceIndex];

/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectActionsForRole = (state, props) =>
  pickBy(state.trixta.actions, (value, key) => split(key, ':', 1)[0] === props.roleName);

/**
 * Returns the common for the  props.actionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.actionName
 */
// eslint-disable-next-line no-unused-vars
const makeSelectActionCommonForRole = (state, props) =>
  createSelector(selectActionForRole, (selectedAction) => {
    if (selectedAction) {
      return get(selectedAction, `common`, {});
    }

    return {};
  });

/**
 * Returns the isntances for the props.actionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.actionName
 */
const makeSelectActionResponseInstancesForRole = () =>
  createSelector(selectActionResponseInstancesForRole, (selectedActionInstances) => {
    if (selectedActionInstances) {
      return selectedActionInstances;
    }

    return [];
  });

const makesSelectActionResponseInstance = () =>
  createSelector(selectActionResponseInstance, (selectedActionInstance) => {
    if (selectedActionInstance) {
      return selectedActionInstance.response;
    }

    return { success: false, error: false };
  });

const makeSelectActionsForRole = () =>
  createSelector(selectActionsForRole, (actions) => actions && actions);

export {
  selectActionForRole,
  selectActionResponseInstancesForRole,
  selectActionResponseInstance,
  selectActionsForRole,
  makeSelectActionsForRole,
  makeSelectActionCommonForRole,
  makeSelectActionResponseInstancesForRole,
  makesSelectActionResponseInstance,
};
