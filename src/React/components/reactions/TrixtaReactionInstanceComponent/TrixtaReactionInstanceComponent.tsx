import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import { makesSelectTrixtaReactionResponseInstance } from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import TrixtaReactJsonSchemaForm from '../../TrixtaFormComponent';
import { TrixtaReactionComponentArgs } from '../types';
import {
  DefaultUnknownType,
  TrixtaInstanceResponse,
  TrixtaState,
} from './../../../types/common';
import { TrixtaReactionInstance } from './../../../types/reactions';
import {
  TrixtaReactionInstanceComponentDispatchProps,
  TrixtaReactionInstanceComponentProps,
} from './types';

function TrixtaReactionInstanceComponent({
  dispatchSubmitReactionResponse,
  roleName,
  reactionName,
  requestForEffect,
  common,
  debugMode,
  children,
  instance,
  instanceRef,
}: ConnectProps & DispatchProps & TrixtaReactionInstanceComponentProps) {
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
      details: instance?.details,
    };
    if (typeof children === 'function') {
      return children(reactionProps);
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, reactionProps);
    }
  }

  if (!hasResponse && !children && instance?.details) {
    const formData = instance?.details.initial_data ?? {};
    const uiSchema = common.request_settings ?? {};
    const schema = common.request_schema ?? {};
    return (
      <TrixtaReactJsonSchemaForm
        formData={formData}
        uiSchema={uiSchema}
        schema={schema}
        idPrefix={`${roleName}-${reactionName}-${instanceRef}`}
        submittable={!requestForEffect}
        onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
          dispatchSubmitReactionResponse(formData);
        }}
      />
    );
  }

  return null;
}

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstance = makesSelectTrixtaReactionResponseInstance();

  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaReactionInstanceComponentProps,
  ) => {
    return {
      instance: getTrixtaReactionResponseInstance(
        state,
        props,
      ) as TrixtaReactionInstance<
        DefaultUnknownType,
        DefaultUnknownType,
        DefaultUnknownType
      >,
    };
  };
  return mapStateToProps;
};

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

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect<
  ConnectProps,
  DispatchProps,
  TrixtaReactionInstanceComponentProps,
  { trixta: TrixtaState }
>(makeMapStateToProps, mapDispatchToProps);

export default connector(
  React.memo(
    TrixtaReactionInstanceComponent,
    (
      props: TrixtaReactionInstanceComponentProps,
      nextProps: TrixtaReactionInstanceComponentProps,
    ) => props.instanceRef === nextProps.instanceRef,
  ),
);
