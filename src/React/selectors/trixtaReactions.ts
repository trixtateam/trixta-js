import { createSelector, ParametricSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TRIXTA_FIELDS } from '../constants';
import { RootState, TrixtaCommon, TrixtaReactionInstance } from '../types/common';
import { TrixtaReaction, TrixtaReactionBaseProps } from '../types/reactions';
import { selectTrixtaRoleNameProp } from './common';

type DefaultSelectorProps = TrixtaReactionBaseProps;

export const selectTrixtaReactionNameProp = (_: RootState, props: DefaultSelectorProps): string =>
  props.reactionName;

export const selectTrixtaReactionTypeProp = (
  _: RootState,
  props: DefaultSelectorProps,
): boolean | undefined => props.requestForEffect;

export const selectTrixtaReactionInstanceIndexProp = (
  _: RootState,
  props: DefaultSelectorProps & { instanceIndex: number },
): number => props.instanceIndex;

export const selectTrixtReactionStateSelector: ParametricSelector<
  RootState,
  DefaultSelectorProps,
  TrixtaReaction | undefined
> = createSelector(
  [selectTrixtaRoleNameProp, selectTrixtaReactionNameProp, (state) => state.trixta.reactions],
  (roleName, reactionName, reactions) => {
    if (reactions[getReducerKeyName({ name: reactionName, role: roleName })]) {
    }
    return undefined;
  },
);

export const getTrixtaReactionState = (
  state: RootState,
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })] &&
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })];

export const selectTrixtaReactions = (state: RootState): Record<string, TrixtaReaction> =>
  state.trixta.reactions;

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionForRole = (
  state: RootState,
  props: DefaultSelectorProps,
): TrixtaReaction | undefined =>
  getTrixtaReactionState(state, props) && getTrixtaReactionState(state, props);

/**
 * Selects the reactions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionLoadingStatus = (
  state: RootState,
  props: DefaultSelectorProps,
): { status?: boolean } | undefined =>
  getTrixtaReactionState(state, props) && getTrixtaReactionState(state, props)?.loadingStatus;

/**
 * Selects the reactions for given props.roleName
 */
export const selectTrixtaReactionsForRole = (
  state: RootState,
  props: DefaultSelectorProps,
): Record<string, TrixtaReaction> =>
  pickBy(state.trixta.reactions, (value, key) => key && key.split(':', 1)[0] === props.roleName);

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for props.requestForEffect
 */
export const selectTrixtaReactionResponseInstancesForRole = (
  state: RootState,
  props: DefaultSelectorProps,
): Array<TrixtaReactionInstance> | undefined =>
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props)?.instances &&
  getTrixtaReactionState(state, props)?.instances[
    props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
  ]
    ? getTrixtaReactionState(state, props)?.instances[
        props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
      ]
    : [];

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceIndex]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 */
export const selectTrixtaReactionResponseInstance = (
  state: RootState,
  props: DefaultSelectorProps & { instanceIndex: number },
): TrixtaReactionInstance | undefined =>
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props)?.instances &&
  getTrixtaReactionState(state, props)?.instances[
    props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
  ]
    ? getTrixtaReactionState(state, props)?.instances[
        props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
      ][props.instanceIndex]
    : undefined;

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 */
export const makeSelectTrixtaReactionResponseInstancesForRole = () =>
  createSelector(
    [selectTrixtReactionStateSelector, selectTrixtaReactionTypeProp],
    (selectedReactionInstance, requestForEffect) => {
      return selectedReactionInstance
        ? selectedReactionInstance?.instances[
            requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
          ]
        : [];
    },
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceIndex]
 * for the given props.roleName , props.reactionName and returns the reaction for props.requestForEffect instance
 */
export const makesSelectTrixtaReactionResponseInstance = () =>
  createSelector(
    [
      selectTrixtReactionStateSelector,
      selectTrixtaReactionTypeProp,
      selectTrixtaReactionInstanceIndexProp,
    ],
    (selectedReactionInstance, requestForEffect, instanceIndex) => {
      return selectedReactionInstance?.instances[
        requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
      ][instanceIndex];
    },
  );

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName , props.reactionName and returns the reaction
 */
export const makesSelectTrixtaReactionForRole = () =>
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
    return selectedReaction;
  });

/**
 * Returns the common for the props.reactionName
 */
export const makeSelectTrixtaReactionCommonForRole = () =>
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
    return get<TrixtaCommon>(selectedReaction, `common`, undefined);
  });

/**
 * Selects the reactions for given props.roleName
 */
export const makeSelectTrixtaReactionsForRole = () =>
  createSelector([selectTrixtaReactions, selectTrixtaRoleNameProp], (trixtaReactions, roleName) =>
    pickBy(trixtaReactions, (value, key) => key && key.split(':', 1)[0] === roleName),
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].loadingStatus
 * for the given props.roleName and returns true or false
 *
 */
export const makeSelectIsTrixtaReactionInProgress = () =>
  createSelector([selectTrixtReactionStateSelector], (selectedReaction) => {
    return selectedReaction ? get(selectedReaction.loadingStatus, 'status', false) : false;
  });

/**
 * Separates the reactions into requestForEffects and requestForResponse
 */
export const makeSelectTrixtaReactionListForRole = () =>
  // eslint-disable-next-line arrow-body-style
  createSelector([selectTrixtaReactions, selectTrixtaRoleNameProp], (trixtaReactions, roleName) => {
    const reactionsForRole = pickBy(
      trixtaReactions,
      (value, key) => key && key.split(':', 1)[0] === roleName,
    );
    const reactionKeys = Object.keys(reactionsForRole);
    const requestForEffects = [] as { name: string; instance: TrixtaReactionInstance }[];
    const requestForResponses = [] as { name: string; instance: TrixtaReactionInstance }[];
    reactionKeys.forEach((key) => {
      const reaction = reactionsForRole[key];
      const instances = get<TrixtaReactionInstance>(reaction, 'instances');
      const effectInstances = get<TrixtaReactionInstance[]>(
        instances,
        TRIXTA_FIELDS.requestForEffect,
        [],
      );

      const responseInstances = get<TrixtaReactionInstance[]>(
        instances,
        TRIXTA_FIELDS.requestForResponse,
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
  });
