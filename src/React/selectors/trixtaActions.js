import { createSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';

export const getTrixtActionState = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })];

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionForRole = (state, props) =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props);

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionLoadingStatus = (state, props) =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props).loadingStatus;

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,
 * props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionResponseInstancesForRole = (state, props) =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props).instances
    ? getTrixtActionState(state, props).instances
    : [];

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName , props.actionName and returns the action instance response
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {Number} props.instanceIndex - index for action instance
 */
export const selectTrixtaActionResponseInstance = (state, props) =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props).instances[props.instanceIndex];

/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const selectTrixtaActionsForRole = (state, props) =>
  pickBy(state.trixta.actions, (value, key) => key && key.split(':', 1)[0] === props.roleName);

/**
 * Selects the actions[props.roleName:props.actionName].common
 * for the given props.roleName ,  props.actionName and returns the action common
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionCommon = (state, props) =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props).common;

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const makeSelectTrixtaActionCommonForRole = () =>
  createSelector(selectTrixtaActionForRole, (selectedAction) => {
    if (selectedAction) {
      return get(selectedAction, `common`, {});
    }

    return {};
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const makeSelectTrixtaActionResponseInstancesForRole = () =>
  createSelector(selectTrixtaActionResponseInstancesForRole, (selectedActionInstances) => {
    if (selectedActionInstances) {
      return selectedActionInstances;
    }

    return [];
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {Number} props.instanceIndex - index for action instance
 */
export const makesSelectTrixtaActionResponseInstance = () =>
  createSelector(selectTrixtaActionResponseInstance, (selectedActionInstance) => {
    if (selectedActionInstance) {
      return selectedActionInstance;
    }

    return {};
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {Number} props.instanceIndex - index for action instance
 */
export const makesSelectTrixtaActionInstanceResponse = () =>
  createSelector(selectTrixtaActionResponseInstance, (selectedActionInstance) => {
    if (selectedActionInstance) {
      return selectedActionInstance.response;
    }

    return { success: false, error: false };
  });

/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const makeSelectTrixtaActionsForRole = () =>
  createSelector(selectTrixtaActionsForRole, (actions) => actions && actions);

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName and returns true or false
 *
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const makeSelectIsTrixtaActionInProgress = () =>
  createSelector(selectTrixtaActionLoadingStatus, (loadingStatus) => {
    if (loadingStatus) {
      return get(loadingStatus, 'status', false);
    }

    return false;
  });
