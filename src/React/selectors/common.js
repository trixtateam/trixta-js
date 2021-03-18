import { createSelector } from 'reselect';
import { get, isNullOrEmpty } from '../../utils';
/**
 * Selects all the roles for the logged in agent
 * @param {*} state
 */
export const selectTrixtaAgentDetails = (state) => state.trixta.agentDetails;

/**
 * Selects the authorizingStatus for joining Trixta roles
 * @param {*} state
 */
export const selectTrixtaAuthorizingStatus = (state) => state.trixta.authorizingStatus;

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 * @param {*} state
 */
export const selectTrixtaAuthorizationStarted = (state) => state.trixta.authorizationStarted;

/**
 * Selects the authorizingStatus for the given roleName
 * @param {*} state
 * @param {String} props.roleName - Trixta role name
 */
export const selectTrixtaAuthorizingStatusForRole = (state, props) =>
  state.trixta.authorizingStatus[props.roleName] && state.trixta.authorizingStatus[props.roleName];

/**
 * Selects the roles for the given props.roleName and checks if included
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
export const selectHasTrixtaRoleAccess = (state, props) =>
  state.trixta.agentDetails && state.trixta.agentDetails.includes(props.roleName);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 * @param {*} state
 */
export const selectIsTrixtaAuhorized = (state) =>
  Object.keys(state.trixta.authorizingStatus).length === 0;

/**
 * Checks if the authorizingStatus has any joining statuses for given props.roleName
 * @param {*} state
 */
export const selectIsTrixtaAuhorizedForRole = (state, props) =>
  state.trixta.authorizingStatus[props.roleName] &&
  get(state.trixta.authorizingStatus[props.roleName], 'status', false);

/**
 * Selects default schema form settings
 * @param {*} state
 */
export const selectSchemaFormSettings = (state) => state.trixta.schemaFormSettings;

export const makeSelectTrixtaAgentDetails = () =>
  createSelector(selectTrixtaAgentDetails, (agentDetails) => agentDetails);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 * @returns true or false
 */
export const makeSelectIsTrixtaAuhorized = () =>
  createSelector(selectIsTrixtaAuhorized, (authorized) => authorized);

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 * @returns true or false
 */
export const makeSelectHasTrixtaAuthorizationStarted = () =>
  createSelector(selectTrixtaAuthorizationStarted, (authorizationStarted) => authorizationStarted);

/**
 *  Selects the roles for the given props.roleName and checks if included
 */
export const makeSelectHasTrixtaRoleAccess = () =>
  createSelector(selectHasTrixtaRoleAccess, (roleFilter) => !!roleFilter);

/**
 * Selects the authorizingStatus for joining Trixta roles
 * @returns true or false
 */
export const makeSelectTrixtaAuthorizingStatus = () =>
  createSelector(selectTrixtaAuthorizingStatus, (authorizingStatus) => authorizingStatus);

/**
 * Selects the authorizingStatus for the given roleName
 * @returns
 */
export const makeSelectTrixtaAuthorizingStatusForRole = () =>
  createSelector(selectTrixtaAuthorizingStatusForRole, (authorizingStatus) => authorizingStatus);

/**
 * Determines if the roles are present for the agent details
 * @param {Array<string>} roles
 */
export const makeSelectHasTrixtaRoleAccessForRoles = () =>
  createSelector(
    selectTrixtaAgentDetails,
    (_, roles) => roles,
    (agentRoles, roles) => {
      if (isNullOrEmpty(roles)) return false;
      if (!Array.isArray(roles)) return false;
      return roles.every((role) => agentRoles.includes(role));
    },
  );

export const makeSelectSchemaFormSettings = () =>
  createSelector(selectSchemaFormSettings, (settings) => settings);
