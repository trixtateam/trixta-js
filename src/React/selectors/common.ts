/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { makeSelectPhoenixChannelByName } from '@trixtateam/phoenix-to-redux';
import { Channel } from 'phoenix';
import {
  createSelector,
  OutputParametricSelector,
  OutputSelector,
  ParametricSelector,
  Selector,
} from 'reselect';
import { get, getChannelName } from '../../utils';
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

export const selectTrixtaLoadingStatusRefProp = (
  _: { trixta: TrixtaState },
  props: TrixtaReactionBaseProps | TrixtaActionBaseProps,
): string | undefined => props.loadingStatusRef;

export const selectTrixtaRoleNameProp = (
  _: { trixta: TrixtaState },
  props: DefaultSelectorProps,
): string => props.roleName;

export const selectTrixtaRolesProp = (
  _: { trixta: TrixtaState },
  props: RolesProps,
): Array<string> => props.roles;

export const selectTrixtaState = (state: {
  trixta: TrixtaState;
}): TrixtaState => state.trixta;

/**
 * Selects all the roles for the logged in agent
 */
export const selectTrixtaAgentDetails = (state: {
  trixta: TrixtaState;
}): Record<string, boolean> => state.trixta.agentDetails;

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
  (state.trixta.agentDetails && state.trixta.agentDetails[props.roleName]) ||
  false;

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

export const makeSelectTrixtaState = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaState,
  (res: TrixtaState) => TrixtaState
> => createSelector([selectTrixtaState], (trixta) => trixta);

export const makeSelectTrixtaAgentDetails = (): OutputSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaState['agentDetails'],
  (res: Record<string, boolean>) => TrixtaState['agentDetails']
> =>
  createSelector(
    [selectTrixtaAgentDetails],
    (agentDetails: Record<string, boolean>) => agentDetails,
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

export const selectTrixtaRoleAccessSelector: ParametricSelector<
  { trixta: TrixtaState },
  DefaultSelectorProps,
  boolean
> = createSelector(
  [selectTrixtaRoleNameProp, selectTrixtaAgentDetails],
  (roleName, agentDetails) => {
    return agentDetails && agentDetails[roleName];
  },
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
  (res1: boolean) => boolean
> =>
  createSelector(
    [selectTrixtaRoleAccessSelector],
    (hasAccess) => hasAccess || false,
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
    (authorizingStatus, roleName) =>
      (authorizingStatus && authorizingStatus[roleName]) || { status: false },
  );

/**
 * Determines if the role is present for the agent details
 * @param {Array<string>} roles
 */
export const makeSelectHasTrixtaRoleAccessForRole = (): OutputParametricSelector<
  {
    trixta: TrixtaState;
  },
  TrixtaBaseRoleProps,
  boolean,
  (res1: boolean) => boolean
> =>
  createSelector([selectHasTrixtaRoleAccess], (hasAccess) => {
    return hasAccess;
  });

/**
 * Returns the phoenix channel for the given role
 * @param role
 * @returns
 */
export const makeSelectPhoenixChannelForRole = (
  role: string,
): Selector<unknown, Channel | undefined> =>
  makeSelectPhoenixChannelByName(getChannelName({ role }));
