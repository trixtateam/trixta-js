/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils/object';
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
import { TrixtaInstanceResponse, TrixtaState } from '../../../types/common';
import { TrixtaReactionComponentArgs } from '../TrixtaReactionComponent/types';
import { TrixtaReactionInstanceResponseComponentProps } from './types';

function TrixtaReactionInstanceResponseComponent({
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
  ...rest
}: ConnectProps &
  DispatchProps &
  TrixtaReactionInstanceResponseComponentProps &
  Record<string, unknown>) {
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
  if (hasResponse) {
    if (typeof children === 'function') {
      return children(reactionProps);
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, reactionProps);
    }
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
    props: TrixtaReactionInstanceResponseComponentProps,
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
  ownProps: TrixtaReactionInstanceResponseComponentProps,
) {
  return {
    dispatchSubmitReactionResponse: (formData?: any) =>
      dispatch(
        submitTrixtaReactionResponse({
          formData,
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

export default connector(
  React.memo(
    TrixtaReactionInstanceResponseComponent,
    (
      props: TrixtaReactionInstanceResponseComponentProps,
      nextProps: TrixtaReactionInstanceResponseComponentProps,
    ) => props.instanceRef === nextProps.instanceRef,
  ),
);
