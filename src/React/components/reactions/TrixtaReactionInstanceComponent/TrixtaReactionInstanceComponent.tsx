import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { get } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import { makesSelectTrixtaReactionResponseInstance } from '../../../selectors';
import { TrixtaDebugType, trixtaInstanceDebugger } from '../../../TrixtaDebugger';
import { RootState, TrixtaInstanceResponse } from '../../../types';
import { TrixtaReactionComponentArgs } from '../types';
import {
  TrixtaReactionInstanceComponentDispatchProps,
  TrixtaReactionInstanceComponentProps,
  TrixtaReactionInstanceComponentStateProps
} from './types';
const TrixtaReactionInstanceComponent = ({
  dispatchSubmitReactionResponse,
  roleName,
  reactionName,
  requestForEffect,
  common,
  debugMode,
  children,
  instance,
}: TrixtaReactionInstanceComponentStateProps &
  TrixtaReactionInstanceComponentDispatchProps &
  TrixtaReactionInstanceComponentProps) => {
  const response = get(instance, 'response', {
    success: false,
    error: false,
  }) as TrixtaInstanceResponse;
  trixtaInstanceDebugger({
    debugMode,
    response,
    roleName,
    instance,
    name: reactionName,
    type: TrixtaDebugType.Reaction,
  });

  const hasResponse = response.error || response.success;

  if (!hasResponse) {
    const reactionProps: TrixtaReactionComponentArgs = {
      dispatchSubmitReactionResponse,
      submit: dispatchSubmitReactionResponse,
      common,
      data: get(instance, 'details.initial_data', {}),
      roleName,
      requestForEffect,
      reactionName,
      response,
      details: instance.details,
    };
    if (typeof children === 'function') {
      return children(reactionProps);
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, reactionProps);
    }
  }

  return null;
};

const mapStateToProps = (state: RootState, props: TrixtaReactionInstanceComponentProps) =>
  createStructuredSelector<RootState, TrixtaReactionInstanceComponentStateProps>({
    instance: makesSelectTrixtaReactionResponseInstance(state, props),
  });

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaReactionInstanceComponentProps,
): TrixtaReactionInstanceComponentDispatchProps {
  return {
    dispatchSubmitReactionResponse: (formData) =>
      dispatch(
        submitTrixtaReactionResponse({
          formData,
          errorEvent: ownProps.errorEvent,
          requestEvent: ownProps.requestEvent,
          responseEvent: ownProps.responseEvent,
          ref: ownProps.instanceRef,
          roleName: ownProps.roleName,
          reactionName: ownProps.reactionName,
        }),
      ),
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default connector(
  React.memo(
    TrixtaReactionInstanceComponent,
    (props, nextProps) => props.instanceRef === nextProps.instanceRef,
  ),
);
