import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTrixtaRoles } from '../../reduxActions/common';
import { UseTrixtaRolesProps } from './types';

/**
 * A react hook that will attempt to join the passed array of roles,
 * on mount of component
 */
export const useTrixtaRoles = ({ roles }: UseTrixtaRolesProps): void => {
  const dispatch = useDispatch();

  const joinTrixtaRoles = useCallback(() => {
    if (!Array.isArray(roles)) return;
    dispatch(updateTrixtaRoles({ roles }));
  }, [roles, dispatch]);

  useEffect(() => {
    joinTrixtaRoles();
  }, [joinTrixtaRoles]);
};
