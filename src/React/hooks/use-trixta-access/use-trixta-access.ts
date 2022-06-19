import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRoles } from '../../selectors';
import { TrixtaState } from '../../types/common';

const roleAccessSelector = makeSelectHasTrixtaRoleAccessForRoles();

export const useTrixtaAccess = (roles?: string | string[]): boolean => {
  const rolesArr = useMemo(
    () => (Array.isArray(roles) ? roles : roles ? [roles] : []),
    [roles],
  );
  return useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );
};
