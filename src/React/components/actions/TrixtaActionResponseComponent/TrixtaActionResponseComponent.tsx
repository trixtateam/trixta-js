import React from 'react';
import { connect } from 'react-redux';
import {
  makesSelectTrixtaLatestActionInstance,
  makesSelectTrixtaLatestActionInstanceResponse,
} from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types';
import { TrixtaActionResponseComponentArgs } from '../types';
import { TrixtaActionResponseComponentProps } from './types';

function TrixtaActionResponseComponent({
  response,
  actionName,
  roleName,
  instance,
  debugMode = false,
  children,
  ...rest
}: TrixtaActionResponseComponentProps & ConnectProps) {
  trixtaInstanceDebugger({
    type: TrixtaDebugType.Action,
    debugMode,
    name: actionName,
    instance,
    response: response ?? { success: false, error: false },
    roleName,
  });
  if (!response) return null;
  const actionProps: TrixtaActionResponseComponentArgs = { ...rest, response };
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { ...actionProps, ...rest });
  }
  if (typeof children === 'function') {
    return children({ ...actionProps, ...rest });
  }

  return null;
}

const makeMapStateToProps = () => {
  const getTrixtaActionResponseInstanceResponse = makesSelectTrixtaLatestActionInstanceResponse();
  const getTrixtaActionResponseInstance = makesSelectTrixtaLatestActionInstance();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaActionResponseComponentProps,
  ) => {
    return {
      response: getTrixtaActionResponseInstanceResponse(state, props),
      instance: getTrixtaActionResponseInstance(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(TrixtaActionResponseComponent);
