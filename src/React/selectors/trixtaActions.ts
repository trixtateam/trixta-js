import { createSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TrixtaAction, TrixtaActionBaseProps } from '../types/actions';
import { RootState, TrixtaCommon, TrixtaInstance } from './../types/common';

export const getTrixtActionState = (
  state: RootState,
  props: TrixtaActionBaseProps,
): TrixtaAction | undefined =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })] &&
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })];

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 */
export const selectTrixtaActionForRole = (
  state: RootState,
  props: TrixtaActionBaseProps,
): TrixtaAction | undefined =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props);

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName, props.actionName and returns the action
 */
export const selectTrixtaActionLoadingStatus = (
  state: RootState,
  props: TrixtaActionBaseProps,
): { status?: boolean } | undefined =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props)?.loadingStatus;

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,
 * props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionResponseInstancesForRole = (
  state: RootState,
  props: TrixtaActionBaseProps,
): TrixtaInstance[] | undefined =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props)?.instances
    ? getTrixtActionState(state, props)?.instances
    : [];

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName , props.actionName and returns the action instance response
 */
export const selectTrixtaActionResponseInstance = (
  state: RootState,
  props: TrixtaActionBaseProps,
): TrixtaInstance | undefined =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props)?.instances[props.instanceIndex];

/**
 * Selects the actions for given props.roleName
 */
export const selectTrixtaActionsForRole = (
  state: RootState,
  props: TrixtaActionBaseProps,
): Record<string, TrixtaAction> =>
  pickBy(state.trixta.actions, (value, key) => key && key.split(':', 1)[0] === props.roleName);

/**
 * Selects the actions[props.roleName:props.actionName].common
 * for the given props.roleName ,  props.actionName and returns the action common
 */
export const selectTrixtaActionCommon = (
  state: RootState,
  props: TrixtaActionBaseProps,
): TrixtaCommon | undefined =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props)?.common;

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
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
 */
export const makeSelectTrixtaActionsForRole = () =>
  createSelector(selectTrixtaActionsForRole, (actions) => actions && actions);

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName and returns true or false
 */
export const makeSelectIsTrixtaActionInProgress = () =>
  createSelector(selectTrixtaActionLoadingStatus, (loadingStatus) => {
    if (loadingStatus) {
      return get(loadingStatus, 'status', false);
    }

    return false;
  });
