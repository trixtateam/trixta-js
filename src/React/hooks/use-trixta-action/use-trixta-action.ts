// ! WORK IN PROGRESS
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
import {
  clearTrixtaActionResponse,
  submitTrixtaActionResponse,
} from '../../reduxActions/trixtaActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaActionRequestStatus,
  makeSelectTrixtaActionResponseInstancesForRole,
} from '../../selectors';
import {
  trixtaDebugger,
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../TrixtaDebugger';
import {
  DefaultUnknownType,
  RequestStatus,
  TrixtaActionBaseProps,
  TrixtaInstance,
  submitTrixtaFunctionParameters,
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
  actionParameters = {
    data: {},
  },
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

  const clearActionResponses = useCallback(() => {
    dispatch(clearTrixtaActionResponse({ roleName, actionName }));
  }, [actionName, roleName, dispatch]);

  const selectHasRoleAccess = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const roleActionProps = { roleName, actionName } as TrixtaActionBaseProps;
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
      if (!hasRoleAccess) return;

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
    [dispatch, roleName, actionName, hasRoleAccess],
  );

  useEffect(() => {
    if (options.autoSubmit) submitTrixtaAction(actionParameters);
  }, [options.autoSubmit, submitTrixtaAction, actionParameters]);

  useEffect(() => {
    if (!latestInstance) return;
    if (requestStatus === RequestStatus.SUCCESS && onSuccess) {
      onSuccess(latestInstance.response.success);
    }

    if (latestInstance.response.error && onError) {
      onError(latestInstance.response.error);
    }
  }, [latestInstance, onError, onSuccess, clearActionResponses, requestStatus]);

  return {
    latestInstance,
    hasRoleAccess,
    isInProgress,
    hasResponse: !!latestInstance,
    clearActionResponses,
    response: latestInstance?.response,
    submitTrixtaAction,
  };
};
