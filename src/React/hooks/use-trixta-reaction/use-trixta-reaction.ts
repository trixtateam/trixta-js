import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  SubmitTrixtaFunctionParameters,
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
  loadingStatusRef,
  onSuccess,
  onError,
  setTimeoutEventAsErrorEvent = false,
}: UseTrixtaReactionProps): UseTrixtaReactionHookReturn<
  TInitialData,
  TResponseType,
  TErrorType
> => {
  const dispatch = useDispatch();
  const latestTimeStamp = useRef<number | undefined>(undefined);
  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  if (isNullOrEmpty(reactionName)) {
    throw Error('Please provide reactionName parameter.');
  }

  const clearReactionResponses = useCallback(() => {
    dispatch(
      clearTrixtaReactionResponse({ roleName, reactionName, loadingStatusRef }),
    );
  }, [dispatch, roleName, reactionName, loadingStatusRef]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectHasRoleAccess: any = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const reactionRoleProps = {
    roleName,
    requestForEffect,
    loadingStatusRef,
    reactionName,
  } as TrixtaReactionBaseProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectIsTrixtaReactionReadyForRole: any = useMemo(
    makesSelectIsTrixtaReactionReadyForRole,
    [],
  );
  const isTrixtaReactionReady = useSelector<{ trixta: TrixtaState }, boolean>(
    (state) => selectIsTrixtaReactionReadyForRole(state, reactionRoleProps),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectReactionResponses: any = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      timeoutEvent,
      timeout,
      ref,
      requestEvent,
      extraData,
    }: SubmitTrixtaFunctionParameters) => {
      if (!hasRoleAccess || !isTrixtaReactionReady) return;
      dispatch(
        submitTrixtaReactionResponse({
          extraData: extraData ?? {},
          formData: data ?? {},
          ref: ref ?? latestInstance?.details.ref,
          loadingStatusRef,
          roleName,
          timeoutEvent: setTimeoutEventAsErrorEvent ? errorEvent : timeoutEvent,
          timeout,
          responseEvent,
          requestEvent,
          errorEvent,
          reactionName,
        }),
      );
    },
    [
      loadingStatusRef,
      hasRoleAccess,
      isTrixtaReactionReady,
      dispatch,
      latestInstance?.details.ref,
      roleName,
      setTimeoutEventAsErrorEvent,
      reactionName,
    ],
  );

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
    onError,
    onSuccess,
    clearReactionResponses,
    requestStatus,
    success,
    error,
    instanceTimeStamp,
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
