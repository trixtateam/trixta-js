import { createSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TRIXTA_FIELDS } from '../constants';
import { RootState, TrixtaReactionInstance } from '../types/common';
import { TrixtaReaction, TrixtaReactionBaseProps } from '../types/reactions';

export const getTrixtaReactionState = (
  state: RootState,
  props: TrixtaReactionBaseProps,
): TrixtaReaction | undefined =>
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })] &&
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })];

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionForRole = (
  state: RootState,
  props: TrixtaReactionBaseProps,
): TrixtaReaction | undefined =>
  getTrixtaReactionState(state, props) && getTrixtaReactionState(state, props);

/**
 * Selects the reactions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName ,  props.reactionName and returns the reaction
 */
export const selectTrixtaReactionLoadingStatus = (
  state: RootState,
  props: TrixtaReactionBaseProps,
): { status?: boolean } | undefined =>
  getTrixtaReactionState(state, props) && getTrixtaReactionState(state, props)?.loadingStatus;

/**
 * Selects the reactions for given props.roleName
 */
export const selectTrixtaReactionsForRole = (
  state: RootState,
  props: TrixtaReactionBaseProps,
): Record<string, TrixtaReaction> =>
  pickBy(state.trixta.reactions, (value, key) => key && key.split(':', 1)[0] === props.roleName);

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 */
export const selectTrixtaReactionResponseInstancesForRole = (
  state: RootState,
  props: TrixtaReactionBaseProps,
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
  props: TrixtaReactionBaseProps,
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
  createSelector(selectTrixtaReactionResponseInstancesForRole, (selectedReactionInstances) => {
    if (selectedReactionInstances) {
      return selectedReactionInstances;
    }

    return [];
  });

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceRef]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 */
export const makesSelectTrixtaReactionResponseInstance = () =>
  createSelector(selectTrixtaReactionResponseInstance, (selectedReactionInstance) => {
    if (selectedReactionInstance) {
      return selectedReactionInstance;
    }

    return {};
  });

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName , props.reactionName and returns the reaction
 */
export const makesSelectTrixtaReactionForRole = () =>
  createSelector(selectTrixtaReactionForRole, (selectedReaction) => {
    if (selectedReaction) {
      return selectedReaction;
    }

    return {};
  });

/**
 * Returns the common for the props.reactionName
 */
export const makeSelectTrixtaReactionCommonForRole = () =>
  createSelector(selectTrixtaReactionForRole, (selectedReaction) => {
    if (selectedReaction) {
      return get(selectedReaction, `common`, {});
    }

    return {};
  });

/**
 * Selects the reactions for given props.roleName
 */
export const makeSelectTrixtaReactionsForRole = () =>
  createSelector(selectTrixtaReactionsForRole, (reactions) => reactions && reactions);

/**
 * Selects the reactions[props.roleName:props.reactionName].loadingStatus
 * for the given props.roleName and returns true or false
 *
 */
export const makeSelectIsTrixtaReactionInProgress = () =>
  createSelector(selectTrixtaReactionLoadingStatus, (loadingStatus) => {
    if (loadingStatus) {
      return get(loadingStatus, 'status', false);
    }

    return false;
  });

/**
 * Separates the reactions into requestForEffects and requestForResponse
 */
export const makeSelectTrixtaReactionListForRole = () =>
  // eslint-disable-next-line arrow-body-style
  createSelector(selectTrixtaReactionsForRole, (reactionsForRole) => {
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
