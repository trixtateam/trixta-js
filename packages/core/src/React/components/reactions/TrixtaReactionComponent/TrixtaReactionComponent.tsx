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
import { TrixtaReactionInstanceComponent } from '../TrixtaReactionInstanceComponent';
import { TrixtaReactionComponentProps } from './types';

/**
 * React component used to pass Trixta Reaction Props to your
 * child component or function.
 */
function TrixtaReactionComponent({
  common,
  roleName,
  reactionName,
  defaultComponent,
  requestForEffect = false,
  includeResponse = false,
  errorEvent,
  responseEvent,
  requestEvent,
  hasRoleAccess,
  debugMode = false,
  instances,
  ...rest
}: ConnectProps & TrixtaReactionComponentProps) {
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

  console.info('TrixtaReactionComponent::common', common);
  console.info('TrixtaReactionComponent::roleName', roleName);
  console.info('TrixtaReactionComponent::reactionName', reactionName);
  console.info('TrixtaReactionComponent::errorEvent', errorEvent);
  console.info('TrixtaReactionComponent::responseEvent', responseEvent);
  console.info('TrixtaReactionComponent::requestForEffect', requestForEffect);
  console.info('TrixtaReactionComponent::requestEvent', requestEvent);
  console.info('TrixtaReactionComponent::instances', instances);

  return (
    <>
      {instances.map((value, index) => (
        <TrixtaReactionInstanceComponent
          key={`${reactionName}-${value.instanceKey}-instance`}
          includeResponse={includeResponse}
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
    props: TrixtaReactionComponentProps,
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
export default connector(TrixtaReactionComponent);
