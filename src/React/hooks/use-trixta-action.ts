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
import { defaultUnknownType, RootState, TrixtaActionBaseProps } from './../types';
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
  const selectHasRoleAccess = useMemo<ReturnType<typeof makeSelectHasTrixtaRoleAccess>>(
    makeSelectHasTrixtaRoleAccess,
    [],
  );
  const hasRoleAccess = useSelector((state: RootState) => selectHasRoleAccess(state, { roleName }));
  const selectActionResponses = useMemo<
    ReturnType<typeof makeSelectTrixtaActionResponseInstancesForRole>
  >(makeSelectTrixtaActionResponseInstancesForRole, []);
  const selectActionInProgress = useMemo<ReturnType<typeof makeSelectIsTrixtaActionInProgress>>(
    makeSelectIsTrixtaActionInProgress,
    [],
  );
  const roleActionProps = { roleName, actionName } as TrixtaActionBaseProps;
  const instances = useSelector((state: RootState) =>
    selectActionResponses(state, roleActionProps),
  );
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
  const isInProgress = useSelector((state: RootState) =>
    selectActionInProgress(state, roleActionProps),
  );

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
