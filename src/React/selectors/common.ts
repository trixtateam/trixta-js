/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createSelector, OutputSelector } from 'reselect';
import { get } from '../../utils';
import { TrixtaActionBaseProps } from './../types/actions/index';
import { TrixtaBaseRoleProps, TrixtaState } from './../types/common';
import { TrixtaReactionBaseProps } from './../types/reactions/index';

type DefaultSelectorProps = TrixtaBaseRoleProps | TrixtaReactionBaseProps | TrixtaActionBaseProps;
type RolesProps = { roles: Array<string> };
export const selectTrixtaRoleNameProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): string => props.roleName;

export const selectTrixtaRolesProp = (
  _: { trixta: TrixtaState },
  props: RolesProps,
): Array<string> => props.roles;

/**
 * Selects all the roles for the logged in agent
 */
export const selectTrixtaAgentDetails = (state: { trixta: TrixtaState }): Array<string> =>
  state.trixta.agentDetails;

/**
 * Selects the authorizingStatus for joining Trixta roles
 */
export const selectTrixtaAuthorizingStatus = (state: {
  trixta: TrixtaState;
}): Record<string, { status?: boolean }> => state.trixta.authorizingStatus;

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 */
export const selectTrixtaAuthorizationStarted = (state: { trixta: TrixtaState }): boolean =>
  state.trixta.authorizationStarted;

/**
 * Selects the authorizingStatus for the given roleName
 */
export const selectTrixtaAuthorizingStatusForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): { status?: boolean } =>
  state.trixta.authorizingStatus[props.roleName] && state.trixta.authorizingStatus[props.roleName];

/**
 * Selects the roles for the given props.roleName and checks if included
 */
export const selectHasTrixtaRoleAccess = (
  state: { trixta: TrixtaState },
  props: TrixtaBaseRoleProps,
): boolean => state.trixta.agentDetails && state.trixta.agentDetails.includes(props.roleName);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 */
export const selectIsTrixtaAuhorized = (state: { trixta: TrixtaState }): boolean =>
  Object.keys(state.trixta.authorizingStatus).length === 0;

/**
 * Checks if the authorizingStatus has any joining statuses for given props.roleName
 */
export const selectIsTrixtaAuhorizedForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
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
  createSelector(
    [selectTrixtaAuthorizationStarted],
    (authorizationStarted) => authorizationStarted,
  );

/**
 *  Selects the roles for the given props.roleName and checks if included
 */
export const makeSelectHasTrixtaRoleAccess = () =>
  createSelector([selectTrixtaAgentDetails, selectTrixtaRoleNameProp], (agentDetails, roleName) =>
    agentDetails.includes(roleName),
  );

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
  createSelector(
    [selectTrixtaAuthorizingStatus, selectTrixtaRoleNameProp],
    (authorizingStatus, roleName) => authorizingStatus[roleName],
  );

/**
 * Selects the authorizingStatus for the given roleName
 * @returns
 */
const selectIsTrixtaAuth = makeSelectIsTrixtaAuhorized();
const selectAuthStarted = makeSelectHasTrixtaAuthorizationStarted();
export const selectIsAuthorizing = createSelector(
  [selectAuthStarted, selectIsTrixtaAuth],
  (hasStarted, hasAuthorized) => (hasStarted ? !hasAuthorized : true),
);

/**
 * Determines if the roles are present for the agent details
 * @param {Array<string>} roles
 */
export const makeSelectHasTrixtaRoleAccessForRoles = (
  roles: string[] | undefined,
): OutputSelector<
  {
    trixta: TrixtaState;
  },
  boolean,
  (res1: string[], res2: string | undefined) => boolean
> =>
  createSelector(selectTrixtaAgentDetails, (agentDetails: Array<string>) => {
    if (!roles || !roles.length) return false;
    return roles.every((role) => agentDetails.includes(role));
  });
