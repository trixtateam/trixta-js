import { createSelector } from 'reselect';
import { getReducerKeyName } from '../../utils';
import { get, pickBy } from '../../utils/object';
import { TRIXTA_FIELDS } from '../constants';

export const getTrixtaReactionState = (state, props) =>
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })];

/**
 * Selects the reactions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 */
export const selectTrixtaReactionForRole = (state, props) => getTrixtaReactionState(state, props);

/**
 * Selects the reactions[props.roleName:props.actionName].loadingStatus
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 */
export const selectTrixtaReactionLoadingStatus = (state, props) =>
  getTrixtaReactionState(state, props).loadingStatus;

/**
 * Selects the reactions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const selectTrixtaReactionsForRole = (state, props) =>
  pickBy(state.trixta.reactions, (value, key) => key && key.split(':', 1)[0] === props.roleName);

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
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props).instances &&
  getTrixtaReactionState(state, props).instances[
    props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
  ]
    ? getTrixtaReactionState(state, props).instances[
        props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
      ]
    : [];

/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceIndex]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {Number} props.instanceIndex - index for reaction instance
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
 */
export const selectTrixtaReactionResponseInstance = (state, props) =>
  getTrixtaReactionState(state, props) &&
  getTrixtaReactionState(state, props).instances &&
  getTrixtaReactionState(state, props).instances[
    props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
  ]
    ? getTrixtaReactionState(state, props).instances[
        props.requestForEffect ? TRIXTA_FIELDS.requestForEffect : TRIXTA_FIELDS.requestForResponse
      ][props.instanceIndex]
    : undefined;

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
 * @param {Number} props.instanceIndex - index for reaction instance
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
 * for the given props.roleName , props.reactionName and returns the reaction
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
 * Selects the reactions[props.roleName:props.reactionName].loadingStatus
 * for the given props.roleName and returns true or false
 *
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {Number} props.instanceIndex - index for reaction instance
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
    const requestForEffects = [];
    const requestForResponses = [];
    reactionKeys.forEach((key) => {
      const reaction = reactionsForRole[key];
      const instances = get(reaction, 'instances', {});
      const effectInstances = get(instances, TRIXTA_FIELDS.requestForEffect, []);

      const responseInstances = get(instances, TRIXTA_FIELDS.requestForResponse, []);

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
