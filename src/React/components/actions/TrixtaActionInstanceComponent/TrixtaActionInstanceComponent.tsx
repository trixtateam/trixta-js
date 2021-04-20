import React from 'react';
import { connect } from 'react-redux';
import { makesSelectTrixtaActionResponseInstance } from '../../../selectors';
import { TrixtaDebugType, trixtaInstanceDebugger } from '../../../TrixtaDebugger';
import { RootState } from '../../../types';
import {
  TrixtaActionInstanceComponentProps,
  TrixtaActionInstanceComponentStateProps
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

const makeMapStateToProps = () => {
  const getTrixtaActionResponseInstance = makesSelectTrixtaActionResponseInstance();
  const mapStateToProps = (state: RootState, props: TrixtaActionInstanceComponentProps) => {
    return {
      response: getTrixtaActionResponseInstance(state, props),
    };
  };
  return mapStateToProps;
};

const connector = connect(makeMapStateToProps, null);
export default connector(TrixtaActionInstanceComponent);
