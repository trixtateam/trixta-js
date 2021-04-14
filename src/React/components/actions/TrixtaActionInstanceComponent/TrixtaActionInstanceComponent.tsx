import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makesSelectTrixtaReactionResponseInstance } from '../../../selectors';
import { TrixtaDebugType, trixtaInstanceDebugger } from '../../../TrixtaDebugger';
import {
  TrixtaActionInstanceComponentProps,
  TrixtaActionInstanceComponentStateProps,
} from './types';

const TrixtaActionInstanceComponent = ({
  response,
  actionName,
  roleName,
  instance,
  debugMode = false,
  children,
  ...props
}: TrixtaActionInstanceComponentProps & TrixtaActionInstanceComponentStateProps) => {
  trixtaInstanceDebugger({
    type: TrixtaDebugType.Action,
    debugMode,
    name: actionName,
    instance,
    response: response ?? { success: false, error: false },
    roleName,
  });
  if (!response) return null;
  const actionProps = { ...props, response };
  if (React.isValidElement(children)) {
    return React.cloneElement(children, actionProps);
  }
  if (typeof children === 'function') {
    return children(actionProps);
  }
};
const mapStateToProps = () =>
  createStructuredSelector({
    response: makesSelectTrixtaReactionResponseInstance(),
  });
const connector = connect(mapStateToProps, null);
export default connector(TrixtaActionInstanceComponent);
