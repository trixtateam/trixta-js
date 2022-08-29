import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRole } from '../../selectors';
import { TrixtaState } from '../../types';
import { TrixtaAuthProps } from './types';

/**
 * React component used to only render a child component or function, if
 * you have access to the passed roleName.
 */
const TrixtaAuthComponent = ({
  children,
  roleName,
  ...rest
}: TrixtaAuthProps & { children: React.ReactNode }): JSX.Element | null => {
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRole, []);
  const hasRoleAccess = useSelector((state: { trixta: TrixtaState }) =>
    roleAccessSelector(state, { roleName }),
  );

  if (!hasRoleAccess) return null;

  if (typeof children === 'function') {
    return children(rest);
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, rest);
  }
  return null;
};
export default TrixtaAuthComponent;
