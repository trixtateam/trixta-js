import React from 'react';
import {
  LOGIN_TRIXTA_SUCCESS,
  ReservedTrixtaRoles,
} from '@trixtateam/trixta-js-core';
import { TrixtaLoginWidgetProps } from './types';
import { TrixtaActionComponent } from '../../components/actions/TrixtaActionComponent';

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
