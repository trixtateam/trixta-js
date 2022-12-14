import React from 'react';
import { connect } from 'react-redux';
import {
  makeSelectTrixtaActionCommonForRole,
  makeSelectTrixtaActionResponseInstancesForRole,
  makesSelectTrixtaLatestActionInstance,
  makesSelectTrixtaLatestActionInstanceResponse,
} from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types';
import {
  TrixtaActionResponseComponentArgs,
  TrixtaActionResponseComponentProps,
} from './types';

/**
 * React component used to pass Trixta Action Response Props to your
 * child component or function.
 */
function TrixtaActionResponseComponent({
  response,
  actionName,
  roleName,
  instance,
  debugMode = false,
  common,
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
  const actionProps: TrixtaActionResponseComponentArgs = {
    ...rest,
    actionName,
    roleName,
    common,
    response,
    instance,
  };
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
  const getTrixtaActionResponseInstancesForRole = makeSelectTrixtaActionResponseInstancesForRole();
  const getTrixtaCommonForRole = makeSelectTrixtaActionCommonForRole();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaActionResponseComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      response: getTrixtaActionResponseInstanceResponse(state, props),
      instances: getTrixtaActionResponseInstancesForRole(state, props),
      instance: getTrixtaActionResponseInstance(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(TrixtaActionResponseComponent);
