import { makeSelectPhoenixSocketDetails } from '@trixta/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectHasTrixtaRoleAccessForRoles,
  makeSelectIsTrixtaAuhorized
} from '../selectors';
import { TrixtaAuthProps } from '../types';
import { RootState } from './../types/common';
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
  const hasRoles = useSelector((state: RootState) => roleAccessSelector(state, rolesArr));
  const socketDetails = useSelector((state: RootState) => socketDetailsSelector(state));
  const isAuthenticated = socketDetails.token || false;
  const hasAuthorizationStarted = useSelector((state: RootState) =>
    authorizationStartedSelector(state),
  );
  const hasAuthorized = useSelector((state: RootState) => authorizedStatusSelector(state));
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