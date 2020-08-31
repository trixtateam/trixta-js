import { createSelector } from 'reselect';
import get from 'lodash/get';
import includes from 'lodash/includes';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import { getReducerKeyName } from '../../utils';
import { TRIXTA_FIELDS } from '../constants';
import { initialState } from '../reducers';

/**
 * Selects all the roles for the logged in agent
 * @param {*} state
 */
const selectAgentDetails = (state) => state.trixta.agentDetails;

/**
 * Selects the loadingStatus
 * @param {*} state
 */
const selectTrixtaLoadingStatus = (state) => state.trixta.loadingStatus;

/**
 * Selects the loading status for the given loadingStatusKey
 * @param {*} state
 * @param {String} props.loadingStatusKey - key for loadingStatus
 */
const selectTrixtaLoadingStatusForKey = (state, props) =>
  state.trixta.loadingStatus[props.loadingStatusKey] || initialState.loadingStatus;

/**
 * Selects the roles for the given props.roleName and checks if included
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectHasRoleAccess = (state, props) => includes(state.trixta.agentDetails, props.roleName);

/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionForRole = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })];

/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionResponseInstancesForRole = (state, props) =>
  get(
    state.trixta.actions,
    `${getReducerKeyName({
      name: props.actionName,
      role: props.roleName,
    })}.instances`,
    []
  );

/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {String} props.instanceIndex - index for action instance
 */
const selectActionResponseInstance = (state, props) =>
  state.trixta.actions[getReducerKeyName({ name: props.actionName, role: props.roleName })]
    .instances[props.instanceIndex];

/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectActionsForRole = (state, props) =>
  pickBy(state.trixta.actions, (value, key) => split(key, ':', 1)[0] === props.roleName);

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
 * Selects default schema form settings
 * @param {*} state
 */
const selectSchemaFormSettings = (state) => state.trixta.schemaFormSettings;

/**
 * Selects the trixta loading status
 */
const makeSelectTrixtaLoadingStatus = () =>
  createSelector(selectTrixtaLoadingStatus, (status) => status);

/**
 * Selects the trixta loading status for props.loadingStatusKey
 */
const makeSelectTrixtaLoadingStatusForKey = () =>
  createSelector(selectTrixtaLoadingStatusForKey, (status) => status);

/**
 * Determines if the given props.roleName has access by returning the first result
 */
const makeSelectHasRoleAccess = () =>
  createSelector(selectHasRoleAccess, (roleFilter) => !!roleFilter);

const makeSelectSchemaFormSettings = () =>
  createSelector(selectSchemaFormSettings, (settings) => settings);

/**
 * Returns the common for the  props.actionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.actionName
 */
// eslint-disable-next-line no-unused-vars
const makeSelectActionCommonForRole = (state, props) =>
  createSelector(selectActionForRole, (selectedAction) => {
    if (selectedAction) {
      return get(selectedAction, `common`, {});
    }

    return {};
  });

/**
 * Returns the isntances for the props.actionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.actionName
 */
const makeSelectActionResponseInstancesForRole = () =>
  createSelector(selectActionResponseInstancesForRole, (selectedActionInstances) => {
    if (selectedActionInstances) {
      return selectedActionInstances;
    }

    return [];
  });

const makesSelectActionResponseInstance = () =>
  createSelector(selectActionResponseInstance, (selectedActionInstance) => {
    if (selectedActionInstance) {
      return selectedActionInstance.response;
    }

    return { success: false, error: false };
  });

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

const makeSelectActionsForRole = () =>
  createSelector(selectActionsForRole, (actions) => actions && actions);

const makeSelectReactionsForRole = () =>
  createSelector(selectReactionsForRole, (reactions) => reactions && reactions);

export {
  selectAgentDetails,
  selectTrixtaLoadingStatus,
  selectTrixtaLoadingStatusForKey,
  selectHasRoleAccess,
  selectActionForRole,
  selectActionResponseInstancesForRole,
  selectActionResponseInstance,
  selectActionsForRole,
  selectReactionForRole,
  selectReactionsForRole,
  selectReactionResponseInstancesForRole,
  selectReactionResponseInstance,
  selectSchemaFormSettings,
  makeSelectReactionsForRole,
  makeSelectActionsForRole,
  makeSelectActionCommonForRole,
  makeSelectReactionResponseInstancesForRole,
  makeSelectReactionCommonForRole,
  makeSelectActionResponseInstancesForRole,
  makesSelectActionResponseInstance,
  makesSelectReactionResponseInstance,
  makeSelectHasRoleAccess,
  makeSelectSchemaFormSettings,
  makeSelectTrixtaLoadingStatus,
  makeSelectTrixtaLoadingStatusForKey,
};
