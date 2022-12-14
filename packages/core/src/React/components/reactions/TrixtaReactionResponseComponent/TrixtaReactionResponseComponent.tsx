import React from 'react';
import { connect } from 'react-redux';
import { isNullOrEmpty } from '../../../../utils/validation';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionCommonForRole,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types/common';
import { TrixtaReactionInstanceResponseComponent } from '../TrixtaReactionInstanceResponseComponent';
import { TrixtaReactionResponseComponentProps } from './types';

/**
 * React component used to pass Trixta Reaction response Props to your
 * child component or function.
 */
function TrixtaReactionResponseComponent({
  common,
  roleName,
  reactionName,
  defaultComponent,
  requestForEffect = false,
  errorEvent,
  responseEvent,
  requestEvent,
  hasRoleAccess,
  debugMode = false,
  instances,
  ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ConnectProps & TrixtaReactionResponseComponentProps) {
  trixtaDebugger({
    type: TrixtaDebugType.Reaction,
    debugMode,
    hasRoleAccess,
    common,
    name: reactionName,
    instances,
    roleName,
  });
  if (!hasRoleAccess) return null;
  if (isNullOrEmpty(common)) return null;
  if (isNullOrEmpty(instances) || !Array.isArray(instances)) {
    if (React.isValidElement(defaultComponent)) {
      return React.cloneElement(defaultComponent);
    }
    return null;
  }

  return (
    <>
      {instances.map((value, index) => (
        <TrixtaReactionInstanceResponseComponent
          key={`${reactionName}-${value.instanceKey}-instance`}
          reactionName={reactionName}
          requestForEffect={requestForEffect}
          common={common}
          errorEvent={errorEvent}
          responseEvent={responseEvent}
          requestEvent={requestEvent}
          roleName={roleName}
          instanceIndex={index}
          instanceRef={value.instanceKey}
          debugMode={debugMode}
          {...rest}
        />
      ))}
    </>
  );
}

const makeMapStateToProps = () => {
  const getTrixtaCommonForRole = makeSelectTrixtaReactionCommonForRole();
  const getTrixtaReactionResponseInstancesForRole = makeSelectTrixtaReactionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaReactionResponseComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      instances: getTrixtaReactionResponseInstancesForRole(state, props),
      hasRoleAccess: getHasTrixtaRoleAccess(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(TrixtaReactionResponseComponent);
