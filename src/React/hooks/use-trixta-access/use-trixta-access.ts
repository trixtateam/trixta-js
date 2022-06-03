import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRoles } from '../../selectors';
import { TrixtaState } from '../../types/common';
import { UseTrixtaAccessProps } from './types';

export const useTrixtaAccess = ({
  roles = [],
}: UseTrixtaAccessProps | undefined = {}): boolean => {
  const rolesArr = useMemo(
    () => (Array.isArray(roles) ? roles : roles ? [roles] : []),
    [roles],
  );
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRoles, []);
  const hasRoles = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );
  const hasAccess = useMemo(() => hasRoles, [hasRoles]);
  return hasAccess;
};
