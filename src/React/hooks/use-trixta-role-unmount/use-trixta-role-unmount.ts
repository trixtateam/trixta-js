import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeTrixtaRole } from '../../reduxActions';
import { UseTrixtaRoleUnmountProps } from './types';

export const useTrixtaRoleUnmount = ({
  roleName,
}: UseTrixtaRoleUnmountProps): void => {
  const dispatch = useDispatch();

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
