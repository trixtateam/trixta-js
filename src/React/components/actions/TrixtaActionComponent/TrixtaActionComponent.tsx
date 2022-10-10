import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaActionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaActionInProgress,
  makeSelectTrixtaActionCommonForRole,
  makeSelectTrixtaActionResponseInstancesForRole,
} from '../../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../../TrixtaDebugger';
import { DefaultUnknownType, TrixtaState } from '../../../types/common';
import TrixtaReactJsonSchemaForm from '../../TrixtaFormComponent';
import { TrixtaActionInstanceComponent } from '../TrixtaActionInstanceComponent';
import { TrixtaActionComponentArgs } from '../types';
import { TrixtaActionComponentProps } from './types';

/**
 * React component used to pass Trixta Action Props to your
 * child component or function. If no child is present, React JSON Scema Form if installed
 * will attempt to render the form with the json schema provided by Trixta
 */
function TrixtaActionComponent({
  dispatchSubmitActionResponse,
  common,
  instances,
  isInProgress,
  roleName,
  actionName,
  hasRoleAccess,
  renderResponse = false,
  children,
  debugMode = false,
  initialData = undefined,
  ...rest
}: TrixtaActionComponentProps &
  DispatchProps &
  ConnectProps &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>) {
  trixtaDebugger({
    type: TrixtaDebugType.Action,
    debugMode,
    hasRoleAccess,
    common,
    name: actionName,
    instances,
    roleName,
  });
  if (!hasRoleAccess) return null;

  const actionProps: TrixtaActionComponentArgs = {
    submit: dispatchSubmitActionResponse,
    common,
    roleName,
    actionName,
    isInProgress,
    response: get(instances, '0.response', { success: false, error: false }),
  };

  if (!renderResponse) {
    if (typeof children === 'function') {
      return children({ ...actionProps, ...rest });
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { ...actionProps, ...rest });
    }

    if (!children && common) {
      const formData =
        initialData !== undefined
          ? initialData
          : common.form_data
          ? common.form_data
          : {};
      const schema = common.request_schema ?? {};
      const uiSchema = common.request_settings ?? {};

      return (
        <TrixtaReactJsonSchemaForm
          idPrefix={`${roleName}-${actionName}`}
          schema={schema}
          isInProgress={isInProgress}
          formContext={{ ...rest }}
          formData={formData}
          uiSchema={uiSchema}
          onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
            dispatchSubmitActionResponse(formData);
          }}
        />
      );
    }
  }

  return instances.map((_, index) => (
    <TrixtaActionInstanceComponent
      key={`${roleName}-${actionName}-${index}`}
      actionName={actionName}
      instance={instances[index]}
      instanceIndex={index}
      debugMode={debugMode}
      roleName={roleName}
      {...rest}
    />
  ));
}

const makeMapStateToProps = () => {
  const getTrixtaCommonForRole = makeSelectTrixtaActionCommonForRole();
  const getTrixtaActionResponseInstancesForRole = makeSelectTrixtaActionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const getIsTrixtaActionInProgress = makeSelectIsTrixtaActionInProgress();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaActionComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      instances: getTrixtaActionResponseInstancesForRole(state, props),
      hasRoleAccess: getHasTrixtaRoleAccess(state, props),
      /**
       * If 'true', Trixta is waiting for response
       */
      isInProgress: getIsTrixtaActionInProgress(state, props),
    };
  };
  return mapStateToProps;
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaActionComponentProps,
) {
  return {
    dispatchSubmitActionResponse: (formData?: DefaultUnknownType) =>
      dispatch(
        submitTrixtaActionResponse({
          extraData: ownProps.extraData,
          errorEvent: ownProps.errorEvent,
          responseEvent: ownProps.responseEvent,
          requestEvent: ownProps.requestEvent,
          timeoutEvent: ownProps.setTimeoutEventAsErrorEvent
            ? ownProps.errorEvent
            : ownProps.timeoutEvent,
          timeout: ownProps.timeout,
          debugMode: ownProps.debugMode,
          formData,
          actionOptions: ownProps.actionOptions,
          debugOptions: ownProps.debugOptions,
          roleName: ownProps.roleName,
          actionName: ownProps.actionName,
          loadingStatusRef: ownProps.loadingStatusRef,
        }),
      ),
  };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps, mapDispatchToProps);
export default connector(TrixtaActionComponent);
