import React from 'react';
import { TrixtaActionComponent } from '../../components/actions';
import { LOGIN_TRIXTA_SUCCESS, ReservedTrixtaRoles } from '../../constants';
import { TrixtaLoginWidgetProps } from './types';

/**
 * React component to login in Trixta space, on successful login
 * trixta will join the **everyone_authed** role.
 */
const TrixtaLoginWidget = (
  props: TrixtaLoginWidgetProps,
): React.ReactElement | null => {
  return (
    <TrixtaActionComponent
      roleName={ReservedTrixtaRoles.EVERYONE_ANON}
      actionName="login"
      responseEvent={LOGIN_TRIXTA_SUCCESS}
      {...props}
    />
  );
};
export default TrixtaLoginWidget;
