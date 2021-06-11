import { makeSelectPhoenixSocketIsAuthenticated } from '@trixta/phoenix-to-redux';
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
  const socketAuthenticatedSelector = useMemo<
    ReturnType<typeof makeSelectPhoenixSocketIsAuthenticated>
  >(makeSelectPhoenixSocketIsAuthenticated, []);
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

  const isAuthenticated = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => socketAuthenticatedSelector(state),
  );
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
    () => ({
      isAuthenticated,
      hasRoles,
      hasAccess: isAuthenticated && hasRoles,
      isAuthorizing,
    }),
    [hasRoles, isAuthenticated, isAuthorizing],
  );

  return values;
};
