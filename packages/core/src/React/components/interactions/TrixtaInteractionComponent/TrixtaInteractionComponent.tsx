import React from 'react';
import { connect } from 'react-redux';
import { isNullOrEmpty } from '../../../../utils';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionCommonForRole,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../../selectors';
import { TrixtaState } from '../../../types';
import { TrixtaInteractionComponentProps } from './types';
import TrixtaInteractionInstanceComponent from './TrixtaInteractionInstanceComponent';

/**
 * React component used to pass Trixta Reaction Props to your
 * child component or function.
 */
function TrixtaInteractionComponent({
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
}: ConnectProps & TrixtaInteractionComponentProps) {
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
        <TrixtaInteractionInstanceComponent
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
    props: TrixtaInteractionComponentProps,
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
export default connector(TrixtaInteractionComponent);
