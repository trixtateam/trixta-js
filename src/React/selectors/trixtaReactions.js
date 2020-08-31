import { createSelector } from 'reselect';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import { getReducerKeyName } from '../../utils';
import { TRIXTA_FIELDS } from '../constants';

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 */
const selectReactionForRole = (state, props) =>
  state.trixta.reactions[getReducerKeyName({ name: props.reactionName, role: props.roleName })];

/**
 * Selects the reactions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectReactionsForRole = (state, props) =>
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
const selectReactionResponseInstancesForRole = (state, props) =>
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
const selectReactionResponseInstance = (state, props) =>
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
 * Returns the instances for the props.reactionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.reactionName
 */
const makeSelectReactionResponseInstancesForRole = () =>
  createSelector(selectReactionResponseInstancesForRole, (selectedReactionInstances) => {
    if (selectedReactionInstances) {
      return selectedReactionInstances;
    }

    return [];
  });

const makesSelectReactionResponseInstance = () =>
  createSelector(selectReactionResponseInstance, (selectedReactionInstance) => {
    if (selectedReactionInstance) {
      return selectedReactionInstance;
    }

    return {};
  });

/**
 * Returns the common for the props.reactionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.reactionName
 */
const makeSelectReactionCommonForRole = () =>
  createSelector(selectReactionForRole, (selectedReaction) => {
    if (selectedReaction) {
      return get(selectedReaction, `common`, {});
    }

    return {};
  });

const makeSelectReactionsForRole = () =>
  createSelector(selectReactionsForRole, (reactions) => reactions && reactions);

export {
  selectReactionForRole,
  selectReactionsForRole,
  selectReactionResponseInstancesForRole,
  selectReactionResponseInstance,
  makeSelectReactionsForRole,
  makeSelectReactionResponseInstancesForRole,
  makeSelectReactionCommonForRole,
  makesSelectReactionResponseInstance,
};
