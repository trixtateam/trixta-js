import { createSelector } from 'reselect';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import { getReducerKeyName } from '../../utils';
import { TRIXTA_FIELDS } from '../constants';
import { selectTrixtaLoadingStatus } from './common';
/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 */
export const selectTrixtaReactionForRole = (state, props) =>
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })];

/**
 * Selects the reactions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const selectTrixtaReactionsForRole = (state, props) =>
  pickBy(state.trixta.reactions, (value, key) => split(key, ':', 1)[0] === props.roleName);

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
 */
export const selectTrixtaReactionResponseInstancesForRole = (state, props) =>
  get(
    state.trixta.reactions,
    `${getReducerKeyName({
      name: props.reactionName,
      role: props.roleName,
    })}.instances.${
      props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
    }`,
    props.requestForEffect ? [] : {}
  );

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceRef]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {String} props.instanceRef - ref for reaction instance
 * @param {String} props.instanceIndex - index for reaction instance
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
 */
export const selectTrixtaReactionResponseInstance = (state, props) =>
  get(
    state.trixta.reactions,
    `${getReducerKeyName({
      name: props.reactionName,
      role: props.roleName,
    })}.instances.${
      props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
    }`,
    props.requestForEffect ? [] : {}
  )[props.requestForEffect ? props.instanceIndex : props.instanceRef];

/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
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
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {String} props.instanceRef - ref for reaction instance
 * @param {String} props.instanceIndex - index for reaction instance
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
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
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
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
 * @param {*} state
 * @param {Object} props
 * @param {String} props.reactionName
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
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const makeSelectTrixtaReactionsForRole = () =>
  createSelector(selectTrixtaReactionsForRole, (reactions) => reactions && reactions);

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceRef|props.instanceIndex]
 * for the given props.roleName and returns trita.loadingStatus[reactionInstance.loadingStatusKey]
 *
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {String} props.instanceRef - ref for reaction instance
 * @param {String} props.instanceIndex - index for reaction instance
 */
export const makeSelectIsTrixtaReactionInProgress = () =>
  createSelector(
    selectTrixtaLoadingStatus,
    selectTrixtaReactionResponseInstance,
    (trixtaLoadingStatus, reactionResponseInstance) => {
      if (reactionResponseInstance && trixtaLoadingStatus) {
        const loadingStatusForAction =
          trixtaLoadingStatus[reactionResponseInstance.details.loadingStatusKey];
        if (loadingStatusForAction) return get(loadingStatusForAction, 'status', false);
      }

      return false;
    }
  );
