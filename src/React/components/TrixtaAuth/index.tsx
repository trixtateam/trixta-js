import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRoles } from '../../selectors';
import { TrixtaAuthProps } from '../../types';

const TrixtaAuth = ({
  children,
  roles,
  ...rest
}: TrixtaAuthProps & { children: React.ReactNode }): JSX.Element | null => {
  const roleAccessSelector = useMemo(
    () =>
      makeSelectHasTrixtaRoleAccessForRoles(Array.isArray(roles) ? roles : roles ? [roles] : []),
    [roles],
  );
  const hasRoleAccess = useSelector(roleAccessSelector);

  if (!hasRoleAccess) return null;
  if (typeof children === 'function') {
    return children(rest);
  }
  if (React.isValidElement(children)) {
    return React.cloneElement(children, rest);
  }
  return null;
};
export default TrixtaAuth;
