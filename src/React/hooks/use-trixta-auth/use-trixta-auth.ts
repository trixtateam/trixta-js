import { makeSelectPhoenixSocketDetails } from '@trixta/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectHasTrixtaRoleAccessForRoles,
  makeSelectIsTrixtaAuhorized,
} from '../../selectors';
import { TrixtaAuthProps } from '../../types';
import { TrixtaState } from './../../types/common';
import { UseTrixtaAuthHookReturn } from './types';

export const useTrixtaAuth = ({
  roles = [],
}: TrixtaAuthProps | undefined = {}): UseTrixtaAuthHookReturn => {
  const rolesArr = useMemo(
    () => (Array.isArray(roles) ? roles : roles ? [roles] : []),
    [roles],
  );
  const socketPhoenixDetailsSelector = useMemo<
    ReturnType<typeof makeSelectPhoenixSocketDetails>
  >(makeSelectPhoenixSocketDetails, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorizedStatusSelector: any = useMemo(
    makeSelectIsTrixtaAuhorized,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorizationStartedSelector: any = useMemo(
    makeSelectHasTrixtaAuthorizationStarted,
    [],
  );
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRoles, []);
  const hasRoles = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const phoenixDetails = useSelector<any, { token?: string }>((state) =>
    socketPhoenixDetailsSelector(state),
  );
  const hasToken = phoenixDetails.token !== undefined;
  const isAuthenticated: boolean | undefined =
    phoenixDetails !== false ? hasToken : undefined;
  const hasAuthorizationStarted = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => authorizationStartedSelector(state),
  );
  const hasAuthorized = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    authorizedStatusSelector(state),
  );
  let isAuthorizing = true;
  if (hasAuthorizationStarted) {
    isAuthorizing = !hasAuthorized;
  }

  const values = useMemo(
    () =>
      isAuthorizing
        ? {
            isAuthenticated,
            hasRoles,
            hasAccess: false,
            isAuthorizing,
          }
        : {
            isAuthenticated,
            hasRoles,
            hasAccess: isAuthenticated === true && hasRoles,
            isAuthorizing,
          },
    [hasRoles, isAuthenticated, isAuthorizing],
  );

  return values;
};
