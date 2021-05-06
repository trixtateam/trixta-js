/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createSelector, ParametricSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TrixtaAction, TrixtaActionBaseProps } from '../types/actions';
import { TrixtaCommon, TrixtaInstance, TrixtaState } from './../types/common';
import { selectTrixtaRoleNameProp } from './common';
type DefaultSelectorProps = TrixtaActionBaseProps;

export const selectTrixtaActionNameProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): string => props.actionName;

export const selectTrixtaActionInstanceIndexProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): number => props.instanceIndex;

export const selectTrixtaActions = (state: {
  trixta: TrixtaState;
}): Record<string, TrixtaAction> => state.trixta.actions;

export const selectTrixtActionStateSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaAction | undefined
> = createSelector(
  [selectTrixtaRoleNameProp, selectTrixtaActionNameProp, selectTrixtaActions],
  (roleName, actionName, trixtaActions) => {
    return trixtaActions[
      getReducerKeyName({ name: actionName, role: roleName })
    ]
      ? trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
      : undefined;
  },
);

export const getTrixtActionState = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaAction | undefined =>
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ] &&
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ];

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 */
export const selectTrixtaActionForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaAction | undefined =>
  getTrixtActionState(state, props) && getTrixtActionState(state, props);

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName, props.actionName and returns the action
 */
export const selectTrixtaActionLoadingStatus = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): { status?: boolean } | undefined =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props)?.loadingStatus;

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,
 * props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
export const selectTrixtaActionResponseInstancesForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaInstance[] | undefined =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props)?.instances
    ? getTrixtActionState(state, props)?.instances
    : [];

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName , props.actionName and returns the action instance response
 */
export const selectTrixtaActionResponseInstance = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): TrixtaInstance | undefined =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props)?.instances[props.instanceIndex];

/**
 * Selects the actions[props.roleName:props.actionName].common
 * for the given props.roleName ,  props.actionName and returns the action common
 */
export const selectTrixtaActionCommon = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaCommon | undefined =>
  getTrixtActionState(state, props) &&
  getTrixtActionState(state, props)?.common;

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 */
export const makeSelectTrixtaActionCommonForRole = () =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    return get<TrixtaCommon>(selectedAction, `common`, undefined);
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 */
export const makeSelectTrixtaActionResponseInstancesForRole = () =>
  createSelector(selectTrixtActionStateSelector, (selectedAction) => {
    return selectedAction ? selectedAction.instances : [];
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 */
export const makesSelectTrixtaActionResponseInstance = () =>
  createSelector(
    [selectTrixtActionStateSelector, selectTrixtaActionInstanceIndexProp],
    (selectedAction, instanceIndex) => {
      return selectedAction
        ? selectedAction.instances[instanceIndex]
        : undefined;
    },
  );

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance
 */
export const makesSelectTrixtaActionInstanceResponse = () =>
  createSelector(
    [selectTrixtActionStateSelector, selectTrixtaActionInstanceIndexProp],
    (selectedAction, instanceIndex) => {
      if (selectedAction) {
        return selectedAction.instances[instanceIndex]?.response
          ? selectedAction.instances[instanceIndex]?.response
          : { success: false, error: false };
      }

      return { success: false, error: false };
    },
  );

/**
 * Selects the actions for given props.roleName
 */
export const makeSelectTrixtaActionsForRole = () =>
  createSelector(
    [selectTrixtaActions, selectTrixtaRoleNameProp],
    (trixtaActions, roleName) =>
      pickBy(
        trixtaActions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      ),
  );

/**
 * Selects the actions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName and returns true or false
 */
export const makeSelectIsTrixtaActionInProgress = () =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    return selectedAction
      ? get<boolean>(selectedAction.loadingStatus, 'status', false)
      : false;
  });
