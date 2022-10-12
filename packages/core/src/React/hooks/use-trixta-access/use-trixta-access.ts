import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRole } from '../../selectors';
import { TrixtaState } from '../../types/common';
import { UseTrixtaAccessProps } from './types';

export const useTrixtaAccess = ({
  roleName,
}: UseTrixtaAccessProps): boolean => {
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRole, []);
  const hasRole = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    roleAccessSelector(state, { roleName }),
  );
  const hasAccess = useMemo(() => hasRole, [hasRole]);
  return hasAccess;
};
