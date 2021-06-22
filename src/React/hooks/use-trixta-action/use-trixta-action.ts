// ! WORK IN PROGRESS
import deequal from 'deequal';
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
  submitTrixtaFunctionParameters,
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
  options = { debugMode: false, autoSubmit: false },
  onSuccess,
  onError,
}: UseTrixtaActionProps): UseTrixtaActionHookReturn<
  TResponseType,
  TErrorType
> => {
  const dispatch = useDispatch();

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
    dispatch(clearTrixtaActionResponse({ roleName, actionName }));
  }, [actionName, roleName, dispatch]);

  const selectHasRoleAccess = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const roleActionProps = { roleName, actionName } as TrixtaActionBaseProps;

  const selectIsTrixtaActionReady = useMemo(
    makeSelectIsTrixtaActionReadyForRole,
    [],
  );
  const isTrixtaActionReady = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => selectIsTrixtaActionReady(state, roleActionProps),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectActionResponses: any = useMemo(
    makeSelectTrixtaActionResponseInstancesForRole,
    [],
  );
  const selectTrixtaActionRequestStatus: any = useMemo(
    makeSelectTrixtaActionRequestStatus,
    [],
  );
  const requestStatus = useSelector<{ trixta: TrixtaState }, RequestStatus>(
    (state) => selectTrixtaActionRequestStatus(state, roleActionProps),
  );
  const isInProgress = requestStatus
    ? requestStatus === RequestStatus.REQUEST
    : false;

  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaInstance<TResponseType, TErrorType>[]
  >((state) => selectActionResponses(state, roleActionProps));
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
    }: submitTrixtaFunctionParameters) => {
      if (!hasRoleAccess || !isTrixtaActionReady) return;

      dispatch(
        submitTrixtaActionResponse({
          formData: data ?? {},
          roleName,
          requestEvent,
          responseEvent,
          errorEvent,
          actionName,
        }),
      );
    },
    [dispatch, isTrixtaActionReady, roleName, actionName, hasRoleAccess],
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
  useEffect(() => {
    if (requestStatus === RequestStatus.SUCCESS && onSuccess) {
      onSuccess(success);
    }

    if (requestStatus === RequestStatus.FAILURE && onError) {
      onError(error);
    }
  }, [success, error, onError, onSuccess, clearActionResponses, requestStatus]);

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
