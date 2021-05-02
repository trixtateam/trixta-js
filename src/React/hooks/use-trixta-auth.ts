import { makeSelectPhoenixSocketIsAuthenticated } from '@trixta/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRoles, selectIsAuthorizing } from '../selectors';
import { TrixtaAuthProps } from '../types';
import { UseTrixtaAuthResponseReturn } from './types';

export const useTrixtaAuth = ({
  roles = [],
}: TrixtaAuthProps | undefined = {}): UseTrixtaAuthResponseReturn => {
  const socketAuthenticatedSelector = useMemo<
    ReturnType<typeof makeSelectPhoenixSocketIsAuthenticated>
  >(makeSelectPhoenixSocketIsAuthenticated, []);
  const roleAccessSelector = useMemo(
    () => makeSelectHasTrixtaRoleAccessForRoles(Array.isArray(roles) ? roles : [roles]),
    [roles],
  );

  const hasRoles = useSelector(roleAccessSelector);
  const isAuthenticated = !!useSelector(socketAuthenticatedSelector);
  const isAuthorizing = useSelector(selectIsAuthorizing);
  return useMemo(
    () => ({
      isAuthenticated,
      hasRoles,
      hasAccess: isAuthenticated && hasRoles,
      isAuthorizing,
    }),
    [hasRoles, isAuthenticated, isAuthorizing],
  );
};
