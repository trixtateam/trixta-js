/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectPhoenixSocketDetails } from '@trixtateam/phoenix-to-redux';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaAuthorizationStarted,
  makeSelectIsTrixtaAuhorized,
} from '../../selectors';
import { useTrixtaAccess } from '../use-trixta-access/use-trixta-access';
import { TrixtaState } from './../../types/common';
import { UseTrixtaAuthHookReturn, UseTrixtaAuthProps } from './types';

const authorizedStatusSelector = makeSelectIsTrixtaAuhorized();
const authorizationStartedSelector = makeSelectHasTrixtaAuthorizationStarted();

export const useTrixtaAuth = ({
  roles,
}: UseTrixtaAuthProps | undefined = {}): UseTrixtaAuthHookReturn => {
  const hasRoles = useTrixtaAccess(roles);
  const socketPhoenixDetailsSelector = useMemo<
    ReturnType<typeof selectPhoenixSocketDetails>
  >(selectPhoenixSocketDetails, []);

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
  const isAuthorizing = hasAuthorizationStarted ? !hasAuthorized : true;

  const values = useMemo(
    () => ({
      isAuthenticated,
      hasRoles,
      hasAccess: isAuthorizing ? false : hasRoles,
      isAuthorizing,
    }),
    [hasRoles, isAuthenticated, isAuthorizing],
  );

  return values;
};
