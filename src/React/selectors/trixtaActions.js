import { createSelector } from 'reselect';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import { getReducerKeyName } from '../../utils';
import { selectTrixtaLoadingStatus } from './common';

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionForRole = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })];

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionResponseInstancesForRole = (state, props) =>
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
export const selectTrixtaActionResponseInstance = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })]
    .instances[props.instanceIndex];

/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const selectTrixtaActionsForRole = (state, props) =>
  pickBy(state.trixta.actions, (value, key) => split(key, ':', 1)[0] === props.roleName);

/**
 * Selects the actions[props.roleName:props.actionName].common
 * for the given props.roleName ,  props.actionName and returns the action common
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionCommon = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })] &&
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })].common;

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
 * @param {String} props.instanceIndex - index for action instance
 */
export const makesSelectTrixtaActionResponseInstance = () =>
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
 * Selects the actions[props.roleName:props.actionName].common.loadingStatusKey
 * for the given props.roleName and returns trita.loadingStatus[common.loadingStatusKey]
 *
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const makeSelectIsTrixtaActionInProgress = () =>
  createSelector(
    selectTrixtaLoadingStatus,
    selectTrixtaActionCommon,
    (trixtaLoadingStatus, commonForAction) => {
      if (commonForAction && trixtaLoadingStatus) {
        const loadingStatusForAction = trixtaLoadingStatus[commonForAction.loadingStatusKey];
        if (loadingStatusForAction) return get(loadingStatusForAction, 'status', false);
      }

      return false;
    }
  );
