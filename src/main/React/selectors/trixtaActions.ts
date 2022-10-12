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
  TrixtaBaseRoleProps,
  TrixtaCommon,
  TrixtaInstance,
  TrixtaInstanceResponse,
  TrixtaState,
} from '../types/common';
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

export const selectTrixtaActionsStateSelector: OutputSelector<
  {
    trixta: TrixtaState;
  },
  Record<string, TrixtaAction>,
  (res: Record<string, TrixtaAction>) => Record<string, TrixtaAction>
> = createSelector([getTrixtaActionsState], (actions) => actions);

export const selectTrixtaActionStateSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaAction | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaActionNameProp,
    selectTrixtaActionsStateSelector,
  ],
  (roleName, actionName, trixtaActions) => {
    return trixtaActions[
      getReducerKeyName({ name: actionName, role: roleName })
    ]
      ? trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
      : undefined;
  },
);

export const selectTrixtaActionRequestStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  RequestStatus | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaActionNameProp,
    selectTrixtaLoadingStatusRefProp,
    selectTrixtaActionStateSelector,
  ],
  (roleName, actionName, loadingStatusRef, trixtaAction) => {
    const requestStatusKey = getRequestStatusKeyName({
      name: actionName,
      role: roleName,
      loadingStatusRef,
    });
    return trixtaAction && trixtaAction.requestStatus[requestStatusKey]
      ? trixtaAction.requestStatus[requestStatusKey]
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
  createSelector([selectTrixtaActionStateSelector], (selectedAction) => {
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
  createSelector([selectTrixtaActionStateSelector], (selectedAction) => {
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
  createSelector(selectTrixtaActionStateSelector, (selectedAction) => {
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
    [selectTrixtaActionStateSelector, selectTrixtaActionInstanceIndexProp],
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
    [selectTrixtaActionStateSelector, selectTrixtaActionInstanceIndexProp],
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
  createSelector([selectTrixtaActionStateSelector], (selectedAction) => {
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
  createSelector([selectTrixtaActionStateSelector], (selectedAction) => {
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
export const makeSelectTrixtaActionsForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaBaseRoleProps,
  TrixtaAction[],
  (res1: Record<string, TrixtaAction>, res2: string) => TrixtaAction[]
> =>
  createSelector(
    [selectTrixtaActionsStateSelector, selectTrixtaRoleNameProp],
    (trixtaActions, roleName) => {
      const trixtaActionsForRole: Record<string, TrixtaAction> = pickBy(
        trixtaActions,
        (_, key) => key && key.split(':', 1)[0] === roleName,
      );
      return Object.entries<TrixtaAction>(trixtaActionsForRole).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value,
      );
    },
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
  createSelector([selectTrixtaActionRequestStatusSelector], (status) => {
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
  createSelector([selectTrixtaActionRequestStatusSelector], (status) => {
    return status;
  });
