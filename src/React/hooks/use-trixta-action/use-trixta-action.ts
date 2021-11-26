import deequal from 'fast-deep-equal';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
import {
  clearTrixtaActionResponse,
  submitTrixtaActionResponse,
} from '../../reduxActions/trixtaActions';
import { makeSelectHasTrixtaRoleAccess } from '../../selectors/common';
import {
  makeSelectIsTrixtaActionReadyForRole,
  makeSelectTrixtaActionRequestStatus,
  makeSelectTrixtaActionResponseInstancesForRole,
} from '../../selectors/trixtaActions';
import {
  trixtaDebugger,
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../TrixtaDebugger';
import {
  DefaultUnknownType,
  RequestStatus,
  SubmitTrixtaFunctionParameters,
  TrixtaActionBaseProps,
  TrixtaInstance,
  TrixtaState,
} from '../../types';
import { UseTrixtaActionHookReturn, UseTrixtaActionProps } from './types';

export const useTrixtaAction = <
  /**
   * Type for response from Trixta
   */
  TResponseType = DefaultUnknownType,
  /**
   * Type for error response from Trixta
   */
  TErrorType = DefaultUnknownType
>({
  roleName,
  actionName,
  actionParameters,
  loadingStatusRef,
  options = {
    debugMode: false,
    autoSubmit: false,
    setTimeoutEventAsErrorEvent: false,
  },
  onSuccess,
  onError,
}: UseTrixtaActionProps<
  TResponseType | unknown,
  TErrorType | unknown
>): UseTrixtaActionHookReturn<TResponseType, TErrorType> => {
  const dispatch = useDispatch();
  const latestTimeStamp = useRef<number | undefined>(undefined);
  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  if (isNullOrEmpty(actionName)) {
    throw Error('Please provide actionName parameter.');
  }

  const actionParamatersRef = useRef<
    UseTrixtaActionProps['actionParameters'] | undefined
  >(undefined);

  const clearActionResponses = useCallback(() => {
    dispatch(
      clearTrixtaActionResponse({ roleName, actionName, loadingStatusRef }),
    );
  }, [dispatch, roleName, actionName, loadingStatusRef]);

  const selectHasRoleAccess = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const actionRoleProps = {
    roleName,
    actionName,
    loadingStatusRef,
  } as TrixtaActionBaseProps;

  const selectIsTrixtaActionReady = useMemo(
    makeSelectIsTrixtaActionReadyForRole,
    [],
  );
  const isTrixtaActionReady = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => selectIsTrixtaActionReady(state, actionRoleProps),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectActionResponses: any = useMemo(
    makeSelectTrixtaActionResponseInstancesForRole,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectTrixtaActionRequestStatus: any = useMemo(
    makeSelectTrixtaActionRequestStatus,
    [],
  );
  const requestStatus = useSelector<{ trixta: TrixtaState }, RequestStatus>(
    (state) => selectTrixtaActionRequestStatus(state, actionRoleProps),
  );
  const isInProgress = requestStatus
    ? requestStatus === RequestStatus.REQUEST
    : false;

  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaInstance<TResponseType, TErrorType>[]
  >((state) => selectActionResponses(state, actionRoleProps));
  trixtaDebugger({
    type: TrixtaDebugType.Action,
    name: actionName,
    roleName,
    debugMode: options.debugMode,
    common: undefined,
    hasRoleAccess,
    instances,
  });
  const [latest] = instances;
  const latestInstance = latest;
  if (latestInstance) {
    trixtaInstanceDebugger({
      type: TrixtaDebugType.Action,
      name: actionName,
      roleName,
      debugMode: options.debugMode,
      response: latestInstance.response,
      instance: latestInstance,
    });
  }

  const submitTrixtaAction = useCallback(
    ({
      data,
      responseEvent,
      requestEvent,
      errorEvent,
      timeoutEvent,
      timeout,
      extraData,
    }: SubmitTrixtaFunctionParameters) => {
      if (!hasRoleAccess || !isTrixtaActionReady) return;

      dispatch(
        submitTrixtaActionResponse({
          extraData: extraData ?? {},
          formData: data ?? {},
          loadingStatusRef,
          roleName,
          requestEvent,
          responseEvent,
          errorEvent,
          timeoutEvent: options.setTimeoutEventAsErrorEvent
            ? errorEvent
            : timeoutEvent,
          timeout,
          actionName,
        }),
      );
    },
    [
      hasRoleAccess,
      isTrixtaActionReady,
      dispatch,
      loadingStatusRef,
      roleName,
      options.setTimeoutEventAsErrorEvent,
      actionName,
    ],
  );

  useEffect(() => {
    if (options.autoSubmit && isTrixtaActionReady) {
      if (
        !deequal(actionParamatersRef.current, actionParameters) ||
        actionParamatersRef.current === undefined
      ) {
        actionParamatersRef.current = actionParameters;
        submitTrixtaAction(actionParameters ?? { data: {} });
      }
    }
  }, [
    options.autoSubmit,
    submitTrixtaAction,
    isTrixtaActionReady,
    actionParameters,
  ]);

  const success = latestInstance ? latestInstance.response.success : false;
  const error = latestInstance ? latestInstance.response.error : false;
  const instanceTimeStamp = latestInstance
    ? latestInstance.response.timeStamp
    : undefined;

  useEffect(() => {
    if (
      requestStatus === RequestStatus.SUCCESS &&
      onSuccess &&
      instanceTimeStamp &&
      instanceTimeStamp !== latestTimeStamp.current
    ) {
      latestTimeStamp.current = instanceTimeStamp;
      onSuccess(success);
    }

    if (
      requestStatus === RequestStatus.FAILURE &&
      onError &&
      instanceTimeStamp &&
      instanceTimeStamp !== latestTimeStamp.current
    ) {
      latestTimeStamp.current = instanceTimeStamp;
      onError(error);
    }
  }, [
    success,
    error,
    onError,
    onSuccess,
    clearActionResponses,
    requestStatus,
    instanceTimeStamp,
  ]);

  return {
    latestInstance,
    hasRoleAccess,
    isInProgress: isTrixtaActionReady ? isInProgress : true,
    loading: !isTrixtaActionReady,
    hasResponse: !!latestInstance,
    clearActionResponses,
    response: latestInstance?.response,
    submitTrixtaAction,
  };
};
