/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createSelector,
  OutputParametricSelector,
  ParametricSelector,
} from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import {
  RequestStatus,
  TrixtaCommon,
  TrixtaReactionInstance,
  TrixtaState,
} from '../types/common';
import { TrixtaReaction, TrixtaReactionBaseProps } from '../types/reactions';
import { selectTrixtaRoleNameProp } from './common';

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

export const selectTrixtReactionStateSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaReaction | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    (state) => state.trixta.reactions,
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

export const selectTrixtReactionRequestStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  RequestStatus | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    (state) => state.trixta.reactions,
  ],
  (roleName, reactionName, trixtaReactions) => {
    return trixtaReactions[
      getReducerKeyName({ name: reactionName, role: roleName })
    ] &&
      trixtaReactions[getReducerKeyName({ name: reactionName, role: roleName })]
        .requestStatus
      ? trixtaReactions[
          getReducerKeyName({ name: reactionName, role: roleName })
        ].requestStatus
      : undefined;
  },
);

export const selectTrixtReactionLoadingStatusSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  TrixtaReaction['loadingStatus'] | undefined
> = createSelector(
  [
    selectTrixtaRoleNameProp,
    selectTrixtaReactionNameProp,
    (state) => state.trixta.reactions,
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

export const getTrixtaReactionState = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  state.trixta.reactions[
    getReducerKeyName({ name: props.reactionName, role: props.roleName })
  ] &&
  state.trixta.reactions[
    getReducerKeyName({ name: props.reactionName, role: props.roleName })
  ];

export const selectTrixtaReactions = (state: {
  trixta: TrixtaState;
}): Record<string, TrixtaReaction> => state.trixta.reactions;

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  getTrixtaReactionState(state, props) && getTrixtaReactionState(state, props);

/**
 * Selects the reactions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionLoadingStatus = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): { status?: boolean } | undefined =>
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props)?.loadingStatus;

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
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props)?.instances &&
  getTrixtaReactionState(state, props)?.instances[
    props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
  ]
    ? getTrixtaReactionState(state, props)?.instances[
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
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props)?.instances &&
  getTrixtaReactionState(state, props)?.instances[
    props.requestForEffect ? 'requestForEffect' : 'requestForResponse'
  ]
    ? getTrixtaReactionState(state, props)?.instances[
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
    [selectTrixtReactionStateSelector, selectTrixtaReactionTypeProp],
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
      selectTrixtReactionStateSelector,
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
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
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
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
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
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
    return get<TrixtaCommon>(selectedReaction, `common`, undefined);
  });

/**
 * Selects the reactions for given props.roleName
 */
export const makeSelectTrixtaReactionsForRole = () =>
  createSelector(
    [selectTrixtaReactions, selectTrixtaRoleNameProp],
    (trixtaReactions, roleName) =>
      pickBy(
        trixtaReactions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      ),
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
  createSelector([selectTrixtReactionRequestStatusSelector], (status) => {
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
  createSelector([selectTrixtReactionRequestStatusSelector], (status) => {
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
    [selectTrixtReactionLoadingStatusSelector],
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
    [selectTrixtaReactions, selectTrixtaRoleNameProp],
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
