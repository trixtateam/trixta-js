/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createSelector,
  OutputParametricSelector,
  OutputSelector,
  ParametricSelector,
} from 'reselect';
import { getReducerKeyName, getRequestStatusKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TrixtaAction, TrixtaActionBaseProps } from '../types/actions';
import {
  RequestStatus,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaInstanceResponse,
  TrixtaState,
} from './../types/common';
import {
  selectTrixtaLoadingStatusRefProp,
  selectTrixtaRoleNameProp,
} from './common';
type DefaultSelectorProps = TrixtaActionBaseProps;

export const selectTrixtaActionNameProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): string => props.actionName;

export const selectTrixtaActionInstanceIndexProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): number => props.instanceIndex;

export const getTrixtActionStateForBaseProps = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaAction | undefined =>
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ] &&
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ];

export const getTrixtaActionsState = (state: {
  trixta: TrixtaState;
}): Record<string, TrixtaAction> => state.trixta.actions;

export const selectTrixtActionsStateSelector: OutputSelector<
  {
    trixta: TrixtaState;
  },
  Record<string, TrixtaAction>,
  (res: Record<string, TrixtaAction>) => Record<string, TrixtaAction>
> = createSelector([getTrixtaActionsState], (actions) => actions);

export const selectTrixtActionStateSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaAction | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaActionNameProp,
    selectTrixtActionsStateSelector,
  ],
  (roleName, actionName, trixtaActions) => {
    return trixtaActions[
      getReducerKeyName({ name: actionName, role: roleName })
    ]
      ? trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
      : undefined;
  },
);

export const selectTrixtActionRequestStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  RequestStatus | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaActionNameProp,
    selectTrixtaLoadingStatusRefProp,
    selectTrixtActionsStateSelector,
  ],
  (roleName, actionName, loadingStatusRef, trixtaActions) => {
    const requestStatusKey = getRequestStatusKeyName({
      name: actionName,
      role: roleName,
      loadingStatusRef,
    });
    const keyName = getReducerKeyName({ name: actionName, role: roleName });
    return trixtaActions[keyName] &&
      trixtaActions[keyName].requestStatus[requestStatusKey]
      ? trixtaActions[keyName].requestStatus[requestStatusKey]
      : undefined;
  },
);

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 */
export const selectTrixtaActionForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaAction | undefined =>
  getTrixtActionStateForBaseProps(state, props) &&
  getTrixtActionStateForBaseProps(state, props);

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
  getTrixtActionStateForBaseProps(state, props) &&
  getTrixtActionStateForBaseProps(state, props)?.instances
    ? getTrixtActionStateForBaseProps(state, props)?.instances
    : [];

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName , props.actionName and returns the action instance response
 */
export const selectTrixtaActionResponseInstance = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): TrixtaInstance | undefined =>
  getTrixtActionStateForBaseProps(state, props) &&
  getTrixtActionStateForBaseProps(state, props)?.instances[props.instanceIndex];

/**
 * Selects the actions[props.roleName:props.actionName].common
 * for the given props.roleName ,  props.actionName and returns the action common
 */
export const selectTrixtaActionCommon = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaCommon | undefined =>
  getTrixtActionStateForBaseProps(state, props) &&
  getTrixtActionStateForBaseProps(state, props)?.common;

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 */
export const makeSelectTrixtaActionCommonForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaCommon,
  (res: TrixtaAction | undefined) => TrixtaCommon
> =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    return get<TrixtaCommon>(selectedAction, `common`, undefined);
  });

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns true or false if it exists
 */
export const makeSelectIsTrixtaActionReadyForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  boolean,
  (res: TrixtaAction | undefined) => boolean
> =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    return selectedAction !== undefined;
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 */
export const makeSelectTrixtaActionResponseInstancesForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaInstance<unknown, unknown>[],
  (res: TrixtaAction | undefined) => TrixtaInstance<unknown, unknown>[]
> =>
  createSelector(selectTrixtActionStateSelector, (selectedAction) => {
    return selectedAction ? selectedAction.instances : [];
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 */
export const makesSelectTrixtaActionResponseInstance = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaInstance<unknown, unknown> | undefined,
  (
    res1: TrixtaAction | undefined,
    res2: number,
  ) => TrixtaInstance<unknown, unknown> | undefined
> =>
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
export const makesSelectTrixtaActionInstanceResponse = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaInstanceResponse<unknown, unknown>,
  (
    res1: TrixtaAction | undefined,
    res2: number,
  ) => TrixtaInstanceResponse<unknown, unknown>
> =>
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
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 */
export const makesSelectTrixtaLatestActionInstanceResponse = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaInstanceResponse<unknown, unknown>,
  (res1: TrixtaAction | undefined) => TrixtaInstanceResponse<unknown, unknown>
> =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    if (selectedAction) {
      return selectedAction.instances[0]?.response
        ? selectedAction.instances[0]?.response
        : { success: false, error: false };
    }

    return { success: false, error: false };
  });

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance
 */
export const makesSelectTrixtaLatestActionInstance = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  TrixtaInstance<unknown, unknown> | undefined,
  (
    res1: TrixtaAction | undefined,
  ) => TrixtaInstance<unknown, unknown> | undefined
> =>
  createSelector([selectTrixtActionStateSelector], (selectedAction) => {
    if (selectedAction) {
      return selectedAction.instances[0]
        ? selectedAction.instances[0]
        : undefined;
    }
    return undefined;
  });

/**
 * Selects the actions for given props.roleName
 */
export const makeSelectTrixtaActionsForRole = () =>
  createSelector(
    [selectTrixtActionsStateSelector, selectTrixtaRoleNameProp],
    (trixtaActions, roleName) =>
      pickBy(
        trixtaActions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      ),
  );

/**
 * Selects the actions[props.roleName:props.actionName].requestStatus
 * ffor the given props.roleName ,  props.actionName and returns true or false
 */
export const makeSelectIsTrixtaActionInProgress = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  boolean,
  (res: RequestStatus | undefined) => boolean
> =>
  createSelector([selectTrixtActionRequestStatusSelector], (status) => {
    return status ? status === RequestStatus.REQUEST : false;
  });

/**
 * Selects the actions[props.roleName:props.actionName].requestStatus
 * for the given props.roleName ,  props.actionName
 */
export const makeSelectTrixtaActionRequestStatus = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaActionBaseProps,
  RequestStatus | undefined,
  (res: RequestStatus | undefined) => RequestStatus | undefined
> =>
  createSelector([selectTrixtActionRequestStatusSelector], (status) => {
    return status;
  });
