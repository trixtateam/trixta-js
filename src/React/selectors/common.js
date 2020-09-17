import { createSelector } from 'reselect';
import includes from 'lodash/includes';
import { initialState } from '../reducers';

/**
 * Selects all the roles for the logged in agent
 * @param {*} state
 */
const selectTrixtaAgentDetails = (state) => state.trixta.agentDetails;

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
const selectHasTrixtaRoleAccess = (state, props) =>
  includes(state.trixta.agentDetails, props.roleName);

/**
 * Selects default schema form settings
 * @param {*} state
 */
const selectSchemaFormSettings = (state) => state.trixta.schemaFormSettings;

const makeSelectTrixtaAgentDetails = () =>
  createSelector(selectTrixtaAgentDetails, (agentDetails) => agentDetails);

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
const makeSelectHasTrixtaRoleAccess = () =>
  createSelector(selectHasTrixtaRoleAccess, (roleFilter) => !!roleFilter);

const makeSelectSchemaFormSettings = () =>
  createSelector(selectSchemaFormSettings, (settings) => settings);

export {
  selectTrixtaAgentDetails,
  selectTrixtaLoadingStatus,
  selectTrixtaLoadingStatusForKey,
  selectHasTrixtaRoleAccess,
  selectSchemaFormSettings,
  makeSelectTrixtaAgentDetails,
  makeSelectTrixtaLoadingStatus,
  makeSelectTrixtaLoadingStatusForKey,
  makeSelectHasTrixtaRoleAccess,
  makeSelectSchemaFormSettings,
};