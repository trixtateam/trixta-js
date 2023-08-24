/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import {
  makeSelectIsTrixtaReactionInProgress,
  makeSelectIsTrixtaReactionLoading,
  makesSelectIsTrixtaReactionReadyForRole,
  makesSelectTrixtaReactionResponseInstance,
} from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import { TrixtaInstanceResponse, TrixtaState } from '../../../types';
import { TrixtaInteractionInstanceComponentProps } from './types';
import { TrixtaReactionComponentArgs } from '../../reactions';

function TrixtaInteractionInstanceComponent({
  dispatchSubmitReactionResponse,
  roleName,
  reactionName,
  requestForEffect,
  common,
  debugMode,
  children,
  instance,
  isInProgress,
  instanceRef,
  loading,
  isReady,
  includeResponse,
  ...rest
}: ConnectProps & DispatchProps & TrixtaInteractionInstanceComponentProps) {
  const response = get<TrixtaInstanceResponse>(instance, 'response', {
    success: false,
    error: false,
  });
  trixtaInstanceDebugger({
    debugMode,
    response,
    roleName,
    instance,
    name: reactionName,
    type: TrixtaDebugType.Reaction,
  });

  const hasResponse = response.error || response.success;
  const reactionProps: TrixtaReactionComponentArgs = {
    submit: dispatchSubmitReactionResponse,
    isInProgress: isReady ? isInProgress : true,
    loading: isReady ? loading : true,
    common,
    data: get(instance, 'details.initial_data', {}),
    roleName,
    requestForEffect,
    reactionName,
    response,
    details: instance?.details,
    instance,
    instanceRef,
    ...rest,
  };

  // HACK: this is a temporary fix for the trixta ide views,
  // because of rjsf the props require formContext and formData but we don't always pass those in,
  // When getting rid of some of the dependency on rjsf
  // the requirement of the below code should be reviewed.
  if (!reactionProps.formData && reactionProps.data) {
    reactionProps.formData = reactionProps.data;
  }

  reactionProps.formContext = {
    ...reactionProps,
  };

  if (hasResponse && !includeResponse) return null;
  if (hasResponse && includeResponse) {
    if (typeof children === 'function') {
      return children(reactionProps);
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, reactionProps);
    }
  }

  if (typeof children === 'function') {
    return children(reactionProps);
  }
  if (React.isValidElement(children)) {
    return React.cloneElement(children, reactionProps);
  }

  return null;
}

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstance = makesSelectTrixtaReactionResponseInstance();
  const getTrixtaReactionInProgress = makeSelectIsTrixtaReactionInProgress();
  const getIsTrixtaReactionLoading = makeSelectIsTrixtaReactionLoading();
  const getIsTrixtaReactionReady = makesSelectIsTrixtaReactionReadyForRole();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaInteractionInstanceComponentProps,
  ) => {
    return {
      instance: getTrixtaReactionResponseInstance(state, props),
      isInProgress: getTrixtaReactionInProgress(state, props),
      loading: getIsTrixtaReactionLoading(state, props),
      isReady: getIsTrixtaReactionReady(state, props),
    };
  };
  return mapStateToProps;
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaInteractionInstanceComponentProps,
) {
  return {
    dispatchSubmitReactionResponse: (formContext?: any) =>
      dispatch(
        submitTrixtaReactionResponse({
          formData: formContext?.formData,
          errorEvent: ownProps.errorEvent,
          extraData: ownProps.extraData,
          timeoutEvent: ownProps.setTimeoutEventAsErrorEvent
            ? ownProps.errorEvent
            : ownProps.timeoutEvent,
          timeout: ownProps.timeout,
          requestEvent: ownProps.requestEvent,
          responseEvent: ownProps.responseEvent,
          ref: ownProps.instanceRef,
          roleName: ownProps.roleName,
          reactionName: ownProps.reactionName,
          loadingStatusRef: ownProps.loadingStatusRef,
        }),
      ),
  };
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps, mapDispatchToProps);
export default connector(React.memo(TrixtaInteractionInstanceComponent));
