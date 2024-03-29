/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createSelector,
  OutputParametricSelector,
  OutputSelector,
  ParametricSelector,
} from 'reselect';
import { getReducerKeyName, getRequestStatusKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import {
  RequestStatus,
  TrixtaBaseRoleProps,
  TrixtaCommon,
  TrixtaState,
} from '../types/common';
import {
  TrixtaReaction,
  TrixtaReactionBaseProps,
  TrixtaReactionInstance,
} from '../types/reactions';
import {
  selectTrixtaLoadingStatusRefProp,
  selectTrixtaRoleNameProp,
} from './common';

type DefaultSelectorProps = TrixtaReactionBaseProps;
export const selectTrixtaReactionNameProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): string => props.reactionName;

export const selectTrixtaReactionTypeProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): boolean | undefined => props.requestForEffect;

export const selectTrixtaReactionInstanceIndexProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): number => props.instanceIndex;

export const getTrixtaReactionStateForBaseProps = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  state.trixta.reactions[
    getReducerKeyName({ name: props.reactionName, role: props.roleName })
  ] &&
  state.trixta.reactions[
    getReducerKeyName({ name: props.reactionName, role: props.roleName })
  ];

export const getTrixtaReactionsState = (state: {
  trixta: TrixtaState;
}): Record<string, TrixtaReaction> => state.trixta.reactions;

export const selectTrixtaReactionsStateSelector: OutputSelector<
  {
    trixta: TrixtaState;
  },
  Record<string, TrixtaReaction>,
  (res: Record<string, TrixtaReaction>) => Record<string, TrixtaReaction>
> = createSelector([getTrixtaReactionsState], (reactions) => reactions);

export const selectTrixtaReactionStateSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaReaction | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    selectTrixtaReactionsStateSelector,
  ],
  (roleName, reactionName, trixtaReactions) => {
    return trixtaReactions[
      getReducerKeyName({ name: reactionName, role: roleName })
    ]
      ? trixtaReactions[
          getReducerKeyName({ name: reactionName, role: roleName })
        ]
      : undefined;
  },
);

export const selectTrixtaReactionRequestStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  RequestStatus | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    selectTrixtaLoadingStatusRefProp,
    selectTrixtaReactionStateSelector,
  ],
  (roleName, reactionName, loadingStatusRef, trixtaReaction) => {
    const requestStatusKey = getRequestStatusKeyName({
      name: reactionName,
      role: roleName,
      loadingStatusRef,
    });
    return trixtaReaction && trixtaReaction.requestStatus[requestStatusKey]
      ? trixtaReaction.requestStatus[requestStatusKey]
      : undefined;
  },
);

export const selectTrixtaReactionLoadingStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaReaction['loadingStatus'] | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    selectTrixtaReactionsStateSelector,
  ],
  (roleName, reactionName, trixtaReactions) => {
    return trixtaReactions[
      getReducerKeyName({ name: reactionName, role: roleName })
    ] &&
      trixtaReactions[getReducerKeyName({ name: reactionName, role: roleName })]
        .loadingStatus
      ? trixtaReactions[
          getReducerKeyName({ name: reactionName, role: roleName })
        ].loadingStatus
      : undefined;
  },
);

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  getTrixtaReactionStateForBaseProps(state, props) &&
  getTrixtaReactionStateForBaseProps(state, props);

/**
 * Selects the reactions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionLoadingStatus = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): { status?: boolean } | undefined =>
  getTrixtaReactionStateForBaseProps(state, props) &&
  getTrixtaReactionStateForBaseProps(state, props)?.loadingStatus;

/**
 * Selects the reactions for given props.roleName
 */
export const selectTrixtaReactionsForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): Record<string, TrixtaReaction> =>
  pickBy(
    state.trixta.reactions,
    (value, key) => key && key.split(':', 1)[0] === props.roleName,
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for props.requestForEffect
 */
export const selectTrixtaReactionResponseInstancesForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): Array<TrixtaReactionInstance> | undefined =>
  getTrixtaReactionStateForBaseProps(state, props) &&
  getTrixtaReactionStateForBaseProps(state, props)?.instances &&
  getTrixtaReactionStateForBaseProps(state, props)?.instances[
    props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
  ]
    ? getTrixtaReactionStateForBaseProps(state, props)?.instances[
        props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
      ]
    : [];

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceIndex]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 */
export const selectTrixtaReactionResponseInstance = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps & { instanceIndex: number },
): TrixtaReactionInstance | undefined =>
  getTrixtaReactionStateForBaseProps(state, props) &&
  getTrixtaReactionStateForBaseProps(state, props)?.instances &&
  getTrixtaReactionStateForBaseProps(state, props)?.instances[
    props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
  ]
    ? getTrixtaReactionStateForBaseProps(state, props)?.instances[
        props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
      ][props.instanceIndex]
    : undefined;

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 */
export const makeSelectTrixtaReactionResponseInstancesForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  TrixtaReactionInstance<unknown, unknown, unknown>[],
  (
    res1: TrixtaReaction | undefined,
    res2: boolean | undefined,
  ) => TrixtaReactionInstance<unknown, unknown, unknown>[]
> =>
  createSelector(
    [selectTrixtaReactionStateSelector, selectTrixtaReactionTypeProp],
    (selectedReaction, requestForEffect) => {
      return selectedReaction
        ? selectedReaction?.instances[
            requestForEffect ? 'requestForEffect' : 'requestForResponse'
          ]
        : [];
    },
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceIndex]
 * for the given props.roleName , props.reactionName and returns the reaction for props.requestForEffect instance
 */
export const makesSelectTrixtaReactionResponseInstance = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  TrixtaReactionInstance<unknown, unknown, unknown> | undefined,
  (
    res1: TrixtaReaction | undefined,
    res2: boolean | undefined,
    res3: number,
  ) => TrixtaReactionInstance<unknown, unknown, unknown> | undefined
> =>
  createSelector(
    [
      selectTrixtaReactionStateSelector,
      selectTrixtaReactionTypeProp,
      selectTrixtaReactionInstanceIndexProp,
    ],
    (selectedReaction, requestForEffect, instanceIndex) => {
      return selectedReaction?.instances[
        requestForEffect ? 'requestForEffect' : 'requestForResponse'
      ][instanceIndex];
    },
  );

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName , props.reactionName and returns the reaction
 */
export const makesSelectTrixtaReactionForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  TrixtaReaction | undefined,
  (res: TrixtaReaction | undefined) => TrixtaReaction | undefined
> =>
  createSelector([selectTrixtaReactionStateSelector], (selectedReaction) => {
    return selectedReaction;
  });

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName , props.reactionName and returns true or false if it exists
 */
export const makesSelectIsTrixtaReactionReadyForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  boolean,
  (res: TrixtaReaction | undefined) => boolean
> =>
  createSelector([selectTrixtaReactionStateSelector], (selectedReaction) => {
    return selectedReaction !== undefined;
  });

/**
 * Returns the common for the props.reactionName
 */
export const makeSelectTrixtaReactionCommonForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  TrixtaCommon,
  (res: TrixtaReaction | undefined) => TrixtaCommon
> =>
  createSelector([selectTrixtaReactionStateSelector], (selectedReaction) => {
    return get<TrixtaCommon>(selectedReaction, `common`, undefined);
  });

/**
 * Selects the reactions for given props.roleName
 */
export const makeSelectTrixtaReactionsForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaBaseRoleProps,
  TrixtaReaction[],
  (res1: Record<string, TrixtaReaction>, res2: string) => TrixtaReaction[]
> =>
  createSelector(
    [selectTrixtaReactionsStateSelector, selectTrixtaRoleNameProp],
    (trixtaReactions, roleName) => {
      const trixtaReactionsForRole: Record<string, TrixtaReaction> = pickBy(
        trixtaReactions,
        (_, key) => key && key.split(':', 1)[0] === roleName,
      );
      return Object.entries<TrixtaReaction>(trixtaReactionsForRole).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value,
      );
    },
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].requestStatus
 * for the given props.roleName and returns true or false
 *
 */
export const makeSelectIsTrixtaReactionInProgress = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  boolean,
  (res: RequestStatus | undefined) => boolean
> =>
  createSelector([selectTrixtaReactionRequestStatusSelector], (status) => {
    return status ? status === RequestStatus.REQUEST : false;
  });

/**
 * Selects the reactions[props.roleName:props.reactionName].requestStatus
 * for the given props.roleName ,  props.reactionName
 */
export const makeSelectTrixtaReactionRequestStatus = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  RequestStatus | undefined,
  (res: RequestStatus | undefined) => RequestStatus | undefined
> =>
  createSelector([selectTrixtaReactionRequestStatusSelector], (status) => {
    return status;
  });

/**
 * Selects the reactions[props.roleName:props.reactionName].loadingStatus
 * for the given props.roleName and returns true or false
 *
 */
export const makeSelectIsTrixtaReactionLoading = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaReactionBaseProps,
  undefined | boolean,
  (res: TrixtaReaction['loadingStatus']) => boolean | undefined
> =>
  createSelector(
    [selectTrixtaReactionLoadingStatusSelector],
    (loadingStatus) => {
      return loadingStatus ? get(loadingStatus, 'status', false) : false;
    },
  );

/**
 * Separates the reactions into requestForEffects and requestForResponse
 */
export const makeSelectTrixtaReactionListForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  DefaultSelectorProps,
  {
    requestForResponses: {
      name: string;
      instance: TrixtaReactionInstance;
    }[];
    requestForEffects: {
      name: string;
      instance: TrixtaReactionInstance;
    }[];
  },
  (
    res1: Record<string, TrixtaReaction>,
    res2: string,
  ) => {
    requestForResponses: {
      name: string;
      instance: TrixtaReactionInstance;
    }[];
    requestForEffects: {
      name: string;
      instance: TrixtaReactionInstance;
    }[];
  }
> =>
  // eslint-disable-next-line arrow-body-style
  createSelector(
    [selectTrixtaReactionsStateSelector, selectTrixtaRoleNameProp],
    (trixtaReactions, roleName) => {
      const reactionsForRole = pickBy(
        trixtaReactions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      );
      const reactionKeys = Object.keys(reactionsForRole);
      const requestForEffects = [] as {
        name: string;
        instance: TrixtaReactionInstance;
      }[];
      const requestForResponses = [] as {
        name: string;
        instance: TrixtaReactionInstance;
      }[];
      reactionKeys.forEach((key) => {
        const reaction = reactionsForRole[key];
        const instances = get<TrixtaReactionInstance>(reaction, 'instances');
        const effectInstances = get<TrixtaReactionInstance[]>(
          instances,
          'requestForEffect',
          [],
        );

        const responseInstances = get<TrixtaReactionInstance[]>(
          instances,
          'requestForResponse',
          [],
        );

        effectInstances.forEach((instance) => {
          requestForEffects.push({
            name: reaction.common.name,
            instance,
          });
        });

        responseInstances.forEach((instance) => {
          requestForResponses.push({
            name: reaction.common.name,
            instance,
          });
        });
      });

      return {
        requestForResponses,
        requestForEffects,
      };
    },
  );
