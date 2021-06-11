/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createSelector,
  OutputParametricSelector,
  OutputSelector,
} from 'reselect';
import { get, isNullOrEmpty } from '../../utils';
import { TrixtaActionBaseProps } from './../types/actions/index';
import {
  LoadingStatus,
  TrixtaBaseRoleProps,
  TrixtaState,
} from './../types/common';
import { TrixtaReactionBaseProps } from './../types/reactions/index';

type DefaultSelectorProps =
  | TrixtaBaseRoleProps
  | TrixtaReactionBaseProps
  | TrixtaActionBaseProps;
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
export const selectTrixtaAgentDetails = (state: {
  trixta: TrixtaState;
}): Array<string> => state.trixta.agentDetails;

/**
 * Selects the authorizingStatus for joining Trixta roles
 */
export const selectTrixtaAuthorizingStatus = (state: {
  trixta: TrixtaState;
}): Record<string, LoadingStatus> => state.trixta.authorizingStatus;

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 */
export const selectTrixtaAuthorizationStarted = (state: {
  trixta: TrixtaState;
}): boolean => state.trixta.authorizationStarted;

/**
 * Selects the authorizingStatus for the given roleName
 */
export const selectTrixtaAuthorizingStatusForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): { status?: boolean } =>
  state.trixta.authorizingStatus[props.roleName] &&
  state.trixta.authorizingStatus[props.roleName];

/**
 * Selects the roles for the given props.roleName and checks if included
 */
export const selectHasTrixtaRoleAccess = (
  state: { trixta: TrixtaState },
  props: TrixtaBaseRoleProps,
): boolean =>
  state.trixta.agentDetails &&
  state.trixta.agentDetails.includes(props.roleName);

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 */
export const selectIsTrixtaAuhorized = (state: {
  trixta: TrixtaState;
}): boolean => Object.keys(state.trixta.authorizingStatus).length === 0;

/**
 * Checks if the authorizingStatus has any joining statuses for given props.roleName
 */
export const selectIsTrixtaAuhorizedForRole = (
  state: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): boolean =>
  state.trixta.authorizingStatus[props.roleName] &&
  get<boolean>(state.trixta.authorizingStatus[props.roleName], 'status', false);

export const makeSelectTrixtaAgentDetails = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaState['agentDetails'],
  (res: string[]) => TrixtaState['agentDetails']
> =>
  createSelector(
    [selectTrixtaAgentDetails],
    (agentDetails: Array<string>) => agentDetails,
  );

/**
 * Checks if the authorizingStatus has no joining statuses for channels
 * @returns true or false
 */
export const makeSelectIsTrixtaAuhorized = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  boolean,
  (res: boolean) => boolean
> => createSelector([selectIsTrixtaAuhorized], (authorized) => authorized);

/**
 * Selects the authorizationStarted, which happens when the first Trixta role is joined
 * @returns true or false
 */
export const makeSelectHasTrixtaAuthorizationStarted = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  boolean,
  (res: boolean) => boolean
> =>
  createSelector(
    [selectTrixtaAuthorizationStarted],
    (authorizationStarted) => authorizationStarted,
  );

/**
 *  Selects the roles for the given props.roleName and checks if included
 */
export const makeSelectHasTrixtaRoleAccess = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  DefaultSelectorProps,
  boolean,
  (res1: string[], res2: string) => boolean
> =>
  createSelector(
    [selectTrixtaAgentDetails, selectTrixtaRoleNameProp],
    (agentDetails, roleName) => agentDetails.includes(roleName),
  );

/**
 * Selects the authorizingStatus for joining Trixta roles
 * @returns true or false
 */
export const makeSelectTrixtaAuthorizingStatus = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  Record<string, LoadingStatus>,
  (res: Record<string, LoadingStatus>) => Record<string, LoadingStatus>
> =>
  createSelector(
    selectTrixtaAuthorizingStatus,
    (authorizingStatus) => authorizingStatus,
  );

/**
 * Selects the authorizingStatus for the given roleName
 * @returns
 */
export const makeSelectTrixtaAuthorizingStatusForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  DefaultSelectorProps,
  LoadingStatus,
  (res1: Record<string, LoadingStatus>, res2: string) => LoadingStatus
> =>
  createSelector(
    [selectTrixtaAuthorizingStatus, selectTrixtaRoleNameProp],
    (authorizingStatus, roleName) => authorizingStatus[roleName],
  );

/**
 * Determines if the roles are present for the agent details
 * @param {Array<string>} roles
 */
export const makeSelectHasTrixtaRoleAccessForRoles = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  RolesProps,
  boolean,
  (res1: string[], res2: string[]) => boolean
> =>
  createSelector(
    [selectTrixtaAgentDetails, selectTrixtaRolesProp],
    (agentDetails, roles) => {
      if (isNullOrEmpty(roles)) return false;
      if (!Array.isArray(roles)) return false;
      return roles.every((role) => agentDetails.includes(role));
    },
  );
