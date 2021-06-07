import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearTrixtaReactionResponse,
  submitTrixtaReactionResponse,
} from '../../reduxActions/trixtaReactions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaReactionInProgress,
  makeSelectIsTrixtaReactionLoading,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../selectors';
import {
  trixtaDebugger,
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../TrixtaDebugger';
import { submitTrixtaFunctionParameters } from '../types';
import {
  DefaultUnknownType,
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
  const selectReactionResponses: any = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectReactionInProgress: any = useMemo(
    makeSelectIsTrixtaReactionInProgress,
    [],
  );
  const isInProgress = useSelector<{ trixta: TrixtaState }, boolean>(
    (state: { trixta: TrixtaState }) =>
      selectReactionInProgress(state, reactionRoleProps),
  );

  const selectReactionLoading: any = useMemo(
    makeSelectIsTrixtaReactionLoading,
    [],
  );
  const loading = useSelector<{ trixta: TrixtaState }, boolean>(
    (state: { trixta: TrixtaState }) =>
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
      if (!hasRoleAccess) return;

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
    [dispatch, roleName, reactionName, hasRoleAccess, latestInstance],
  );

  useEffect(() => {
    if (!latestInstance) return;
    if (latestInstance.response.success && onSuccess) {
      if (onSuccess(latestInstance.response.success) === false)
        clearReactionResponses();
    }

    if (latestInstance.response.error && onError) {
      if (onError(latestInstance.response.error) === false)
        clearReactionResponses();
    }
  }, [latestInstance, onError, onSuccess, clearReactionResponses]);

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
    isInProgress,
    loading,
    clearReactionResponses,
    submitTrixtaReaction,
  };
};
