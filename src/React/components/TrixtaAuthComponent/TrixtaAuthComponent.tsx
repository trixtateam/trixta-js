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
}: TrixtaAuthProps): React.ReactElement | null => {
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRole, []);
  const hasRoleAccess = useSelector((state: { trixta: TrixtaState }) =>
    roleAccessSelector(state, { roleName }),
  );

  if (!hasRoleAccess) return null;
  return typeof children === 'function' ? children() : <>{children}</>;
};
export default TrixtaAuthComponent;
