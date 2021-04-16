import { createSelector } from 'reselect';
import { get, isNullOrEmpty } from '../../utils';
import { RootState, TrixtaBaseRoleProps } from './../types/common';

/**
 * Selects all the roles for the logged in agent
 */
export const selectTrixtaAgentDetails = (state: RootState): Array<string> =>
  state.trixta.agentDetails;

/**
 * Selects the authorizingStatus for joining Trixta roles
 */
export const selectTrixtaAuthorizingStatus = (
  state: RootState,
): Record<string, { status?: boolean }> => state.trixta.authorizingStatus;

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 */
export const selectTrixtaAuthorizationStarted = (state: RootState): boolean =>
  state.trixta.authorizationStarted;

/**
 * Selects the authorizingStatus for the given roleName
 */
export const selectTrixtaAuthorizingStatusForRole = (
  state: RootState,
  props: TrixtaBaseRoleProps,
): { status?: boolean } =>
  state.trixta.authorizingStatus[props.roleName] && state.trixta.authorizingStatus[props.roleName];

/**
 * Selects the roles for the given props.roleName and checks if included
 */
export const selectHasTrixtaRoleAccess = (state: RootState, props: TrixtaBaseRoleProps): boolean =>
  state.trixta.agentDetails && state.trixta.agentDetails.includes(props.roleName);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 */
export const selectIsTrixtaAuhorized = (state: RootState): boolean =>
  Object.keys(state.trixta.authorizingStatus).length === 0;

/**
 * Checks if the authorizingStatus has any joining statuses for given props.roleName
 */
export const selectIsTrixtaAuhorizedForRole = (
  state: RootState,
  props: TrixtaBaseRoleProps,
): boolean =>
  state.trixta.authorizingStatus[props.roleName] &&
  get<boolean>(state.trixta.authorizingStatus[props.roleName], 'status', false);

export const makeSelectTrixtaAgentDetails = () =>
  createSelector([selectTrixtaAgentDetails], (agentDetails: Array<string>) => agentDetails);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 * @returns true or false
 */
export const makeSelectIsTrixtaAuhorized = () =>
  createSelector([selectIsTrixtaAuhorized], (authorized) => authorized);

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
    [selectTrixtaAgentDetails, (_: Array<string>, roles: Array<string>) => roles],
    (agentRoles, roles) => {
      if (isNullOrEmpty(roles)) return false;
      if (!Array.isArray(roles)) return false;
      return roles.every((role) => agentRoles.includes(role));
    },
  );
