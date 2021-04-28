import { makeSelectPhoenixSocketIsAuthenticated } from '@trixta/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectHasTrixtaRoleAccessForRoles,
  makeSelectIsTrixtaAuhorized,
} from '../selectors';
import { TrixtaAuthProps } from '../types';
import { TrixtaState } from './../types/common';
import { UseTrixtaAuthResponseReturn } from './types';

export const useTrixtaAuth = ({
  roles = [],
}: TrixtaAuthProps | undefined = {}): UseTrixtaAuthResponseReturn => {
  const rolesArr = useMemo(() => (Array.isArray(roles) ? roles : roles ? [roles] : []), [roles]);
  const socketAuthenticatedSelector = useMemo<
    ReturnType<typeof makeSelectPhoenixSocketIsAuthenticated>
  >(makeSelectPhoenixSocketIsAuthenticated, []);
  const authorizedStatusSelector = useMemo<ReturnType<typeof makeSelectIsTrixtaAuhorized>>(
    makeSelectIsTrixtaAuhorized,
    [],
  );
  const authorizationStartedSelector = useMemo<
    ReturnType<typeof makeSelectHasTrixtaAuthorizationStarted>
  >(makeSelectHasTrixtaAuthorizationStarted, []);
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRoles, []);
  const hasRoles = useSelector((state: { trixta: TrixtaState }) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );

  const isAuthenticated = useSelector((state) => socketAuthenticatedSelector(state));
  const hasAuthorizationStarted = useSelector((state: { trixta: TrixtaState }) =>
    authorizationStartedSelector(state),
  );
  const hasAuthorized = useSelector((state: { trixta: TrixtaState }) =>
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
