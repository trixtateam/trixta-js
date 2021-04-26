// ! WORK IN PROGRESS
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearTrixtaActionResponse,
  submitTrixtaActionResponse
} from '../reduxActions/trixtaActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaActionInProgress,
  makeSelectTrixtaActionResponseInstancesForRole
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType, trixtaInstanceDebugger } from '../TrixtaDebugger';
import { TrixtaState } from '../types';
import { defaultUnknownType, TrixtaActionBaseProps, TrixtaInstance } from './../types';
import {
  submitTrixtaFunctionParameters,
  UseTrixtaActionProps,
  UseTrixtaActionResponseReturn
} from './types';

export const useTrixtaAction = <
  /**
   * Type for response from Trixta
   */
  TResponseType = defaultUnknownType,
  /**
   * Type for error response from Trixta
   */
  TErrorType = defaultUnknownType
>({
  roleName,
  actionName,
  debugMode = false,
  onSuccess,
  onError,
}: UseTrixtaActionProps): UseTrixtaActionResponseReturn<TResponseType, TErrorType> => {
  const dispatch = useDispatch();
  const clearResponses = useCallback(() => {
    dispatch(clearTrixtaActionResponse({ roleName, actionName }));
  }, [actionName, roleName, dispatch]);
  const selectHasRoleAccess = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const roleActionProps = { roleName, actionName } as TrixtaActionBaseProps;
  const selectActionResponses: any = useMemo(makeSelectTrixtaActionResponseInstancesForRole, []);
  const selectActionInProgress: any = useMemo(makeSelectIsTrixtaActionInProgress, []);
  const isInProgress = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectActionInProgress(state, roleActionProps),
  );

  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaInstance<TResponseType, TErrorType>[]
  >((state) => selectActionResponses(state, roleActionProps));
  trixtaDebugger({
    type: TrixtaDebugType.Action,
    name: actionName,
    roleName,
    debugMode,
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
      debugMode,
      response: latestInstance.response,
      instance: latestInstance,
    });
  }

  const submitTrixtaAction = useCallback(
    ({ data, responseEvent, requestEvent, errorEvent }: submitTrixtaFunctionParameters) => {
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
    if (!latestInstance) return;
    if (latestInstance.response.success && onSuccess) {
      if (onSuccess(latestInstance.response.success) === false) clearResponses();
    }

    if (latestInstance.response.error && onError) {
      if (onError(latestInstance.response.error) === false) clearResponses();
    }
  }, [latestInstance]);

  return {
    latestInstance,
    hasRoleAccess,
    isInProgress,
    hasResponse: !!latestInstance,
    response: latestInstance?.response,
    submitTrixtaAction,
  };
};
