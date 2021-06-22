import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
import {
  clearTrixtaReactionResponse,
  submitTrixtaReactionResponse,
} from '../../reduxActions/trixtaReactions';
import { makeSelectHasTrixtaRoleAccess } from '../../selectors/common';
import {
  makeSelectIsTrixtaReactionLoading,
  makeSelectTrixtaReactionRequestStatus,
  makeSelectTrixtaReactionResponseInstancesForRole,
  makesSelectIsTrixtaReactionReadyForRole,
} from '../../selectors/trixtaReactions';
import {
  trixtaDebugger,
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../TrixtaDebugger';
import {
  DefaultUnknownType,
  RequestStatus,
  submitTrixtaFunctionParameters,
  TrixtaReactionInstance,
  TrixtaState,
} from './../../types/common';
import { TrixtaReactionBaseProps } from './../../types/reactions';
import { UseTrixtaReactionHookReturn, UseTrixtaReactionProps } from './types';

export const useTrixtaReaction = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = DefaultUnknownType,
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
  reactionName,
  requestForEffect = false,
  debugMode = false,
  onSuccess,
  onError,
}: UseTrixtaReactionProps): UseTrixtaReactionHookReturn<
  TInitialData,
  TResponseType,
  TErrorType
> => {
  const dispatch = useDispatch();

  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  if (isNullOrEmpty(reactionName)) {
    throw Error('Please provide reactionName parameter.');
  }

  const clearReactionResponses = useCallback(() => {
    dispatch(clearTrixtaReactionResponse({ roleName, reactionName }));
  }, [reactionName, roleName, dispatch]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectHasRoleAccess: any = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const reactionRoleProps = {
    roleName,
    requestForEffect,
    reactionName,
  } as TrixtaReactionBaseProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const selectIsTrixtaReactionReadyForRole: any = useMemo(
    makesSelectIsTrixtaReactionReadyForRole,
    [],
  );
  const isTrixtaReactionReady = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => selectIsTrixtaReactionReadyForRole(state, reactionRoleProps),
  );
  const selectReactionResponses: any = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  const selectTrixtaReactionRequestStatus: any = useMemo(
    makeSelectTrixtaReactionRequestStatus,
    [],
  );
  const requestStatus = useSelector<{ trixta: TrixtaState }, RequestStatus>(
    (state) => selectTrixtaReactionRequestStatus(state, reactionRoleProps),
  );
  const isInProgress = requestStatus
    ? requestStatus === RequestStatus.REQUEST
    : false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectReactionLoading: any = useMemo(
    makeSelectIsTrixtaReactionLoading,
    [],
  );
  const loading = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectReactionLoading(state, reactionRoleProps),
  );

  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaReactionInstance<TInitialData, TResponseType, TErrorType>[]
  >((state) => selectReactionResponses(state, reactionRoleProps));

  const [latest] = instances;
  const latestInstance = latest;
  if (latestInstance) {
    trixtaInstanceDebugger({
      type: TrixtaDebugType.Reaction,
      name: reactionName,
      roleName,
      debugMode,
      response: latestInstance.response,
      instance: latestInstance,
    });
  }
  const submitTrixtaReaction = useCallback(
    ({
      data,
      responseEvent,
      errorEvent,
      ref,
      requestEvent,
    }: submitTrixtaFunctionParameters) => {
      if (!hasRoleAccess || !isTrixtaReactionReady) return;

      dispatch(
        submitTrixtaReactionResponse({
          formData: data ?? {},
          ref: ref ?? latestInstance?.details.ref,
          roleName,
          responseEvent,
          requestEvent,
          errorEvent,
          reactionName,
        }),
      );
    },
    [
      dispatch,
      roleName,
      reactionName,
      isTrixtaReactionReady,
      hasRoleAccess,
      latestInstance,
    ],
  );

  const success = latestInstance ? latestInstance.response.success : false;
  const error = latestInstance ? latestInstance.response.error : false;
  useEffect(() => {
    if (requestStatus === RequestStatus.SUCCESS && onSuccess) {
      onSuccess(success);
    }

    if (requestStatus === RequestStatus.FAILURE && onError) {
      onError(error);
    }
  }, [
    onError,
    onSuccess,
    clearReactionResponses,
    requestStatus,
    success,
    error,
  ]);

  trixtaDebugger({
    type: TrixtaDebugType.Reaction,
    name: reactionName,
    roleName,
    debugMode,
    common: undefined,
    hasRoleAccess,
    instances,
  });

  return {
    latestInstance,
    initialData: latestInstance?.details?.initial_data,
    latestResponse: latestInstance?.response,
    hasRoleAccess,
    hasResponse: !!latestInstance,
    instances,
    isInProgress: isTrixtaReactionReady ? isInProgress : true,
    loading: isTrixtaReactionReady ? loading : true,
    clearReactionResponses,
    submitTrixtaReaction,
  };
};
