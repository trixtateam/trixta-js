import { makeSelectPhoenixSocketDetails } from '@trixta/phoenix-to-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectHasTrixtaRoleAccessForRoles,
  makeSelectIsTrixtaAuhorized,
} from '../selectors';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TrixtaAuthProps } from '../types';
import { UseTrixtaAuthResponseReturn } from './types';

export const useTrixtaAuth = ({
  roles = [],
}: TrixtaAuthProps | undefined = {}): UseTrixtaAuthResponseReturn => {
  const rolesArr = Array.isArray(roles) ? roles : [roles];
  const socketDetailsSelector = useMemo<ReturnType<typeof makeSelectPhoenixSocketDetails>>(
    makeSelectPhoenixSocketDetails,
    [],
  );
  const authorizedStatusSelector = useMemo<ReturnType<typeof makeSelectIsTrixtaAuhorized>>(
    makeSelectIsTrixtaAuhorized,
    [],
  );
  const authorizationStartedSelector = useMemo<
    ReturnType<typeof makeSelectHasTrixtaAuthorizationStarted>
  >(makeSelectHasTrixtaAuthorizationStarted, []);
  const roleAccessSelector = useMemo<ReturnType<typeof makeSelectHasTrixtaRoleAccessForRoles>>(
    makeSelectHasTrixtaRoleAccessForRoles,
    [],
  );
  const hasRoles = useSelector((state) => roleAccessSelector(state, rolesArr));
  const socketDetails = useSelector((state) => socketDetailsSelector(state));
  const isAuthenticated = socketDetails.token || false;
  const hasAuthorizationStarted = useSelector((state) => authorizationStartedSelector(state));
  const hasAuthorized = useSelector((state) => authorizedStatusSelector(state));
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
