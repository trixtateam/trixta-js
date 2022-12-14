import { selectPhoenixSocketDetails } from '@trixtateam/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectTrixtaAuthorizingStatusForRole,
} from '../../selectors';
import { LoadingStatus, TrixtaState } from '../../types/common';
import { useTrixtaAccess } from '../use-trixta-access/use-trixta-access';
import { UseTrixtaAuthHookReturn, UseTrixtaAuthProps } from './types';

export const useTrixtaAuth = ({
  roleName,
}: UseTrixtaAuthProps | undefined = {}): UseTrixtaAuthHookReturn => {
  const hasRole = useTrixtaAccess({ roleName: roleName || '' });
  const socketPhoenixDetailsSelector = useMemo<
    ReturnType<typeof selectPhoenixSocketDetails>
  >(selectPhoenixSocketDetails, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorizedStatusSelector: any = useMemo(
    makeSelectTrixtaAuthorizingStatusForRole,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorizationStartedSelector: any = useMemo(
    makeSelectHasTrixtaAuthorizationStarted,
    [],
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
  const authorizedStatus = useSelector<{ trixta: TrixtaState }, LoadingStatus>(
    (state) => authorizedStatusSelector(state, { roleName }),
  );

  const hasAuthorized = authorizedStatus.status || false;
  let isAuthorizing = true;
  if (hasAuthorizationStarted) {
    isAuthorizing = hasAuthorized;
  }

  const values = useMemo(
    () =>
      isAuthorizing
        ? {
            isAuthenticated,
            hasRole,
            hasAccess: false,
            isAuthorizing,
          }
        : {
            isAuthenticated,
            hasRole,
            hasAccess: isAuthenticated === true && hasRole,
            isAuthorizing: false,
          },
    [hasRole, isAuthenticated, isAuthorizing],
  );

  return values;
};
