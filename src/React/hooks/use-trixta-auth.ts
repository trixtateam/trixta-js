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
  const rolesArr = useMemo(() => (Array.isArray(roles) ? roles : roles ? [roles] : []), [roles]);
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
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRoles, []);
  const hasRoles = useSelector((state: RootState) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );
  const socketDetails = useSelector<RootState, { token?: string }>((state: RootState) =>
    socketDetailsSelector(state),
  );
  const isAuthenticated = socketDetails.token !== undefined ? true : false;
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
