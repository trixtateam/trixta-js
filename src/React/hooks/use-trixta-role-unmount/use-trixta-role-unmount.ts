import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
import { removeTrixtaRole } from '../../reduxActions';
import { UseTrixtaRoleUnmountProps } from './types';

/**
 * A react hook that will attempt to leave the passed roleName,
 * on unmount of component
 */
export const useTrixtaRoleUnmount = ({
  roleName,
}: UseTrixtaRoleUnmountProps): void => {
  const dispatch = useDispatch();

  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  const leaveTrixtaRole = useCallback(() => {
    dispatch(
      removeTrixtaRole({
        name: roleName,
      }),
    );
  }, [roleName, dispatch]);

  useEffect(() => {
    return () => {
      leaveTrixtaRole();
    };
  }, [leaveTrixtaRole, roleName]);
};
