import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTrixtaReactionResponse } from '../reduxActions/trixtaReactions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaReactionInProgress,
  makeSelectTrixtaReactionResponseInstancesForRole
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType, trixtaInstanceDebugger } from '../TrixtaDebugger';
import { defaultUnknownType, RootState, TrixtaReactionBaseProps } from './../types';
import {
  submitTrixtaFunctionParameters,
  UseTrixtaReactionProps,
  UseTrixtaReactionResponseReturn
} from './types';

export const useTrixtaReaction = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = defaultUnknownType,
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
  reactionName,
  requestForEffect = false,
  debugMode = false,
}: UseTrixtaReactionProps): UseTrixtaReactionResponseReturn<
  TInitialData,
  TResponseType,
  TErrorType
> => {
  const dispatch = useDispatch();

  const selectHasRoleAccess = useMemo<ReturnType<typeof makeSelectHasTrixtaRoleAccess>>(
    makeSelectHasTrixtaRoleAccess,
    [],
  );
  const hasRoleAccess = useSelector((state: RootState) => selectHasRoleAccess(state, { roleName }));
  const selectReactionResponses = useMemo<
    ReturnType<typeof makeSelectTrixtaReactionResponseInstancesForRole>
  >(makeSelectTrixtaReactionResponseInstancesForRole, []);
  const selectReactionInProgress = useMemo<ReturnType<typeof makeSelectIsTrixtaReactionInProgress>>(
    makeSelectIsTrixtaReactionInProgress,
    [],
  );
  const reactionRoleProps = { roleName, requestForEffect, reactionName } as TrixtaReactionBaseProps;
  const instances = useSelector((state: RootState) =>
    selectReactionResponses(state, reactionRoleProps),
  );

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
    ({ data, responseEvent, errorEvent, ref, requestEvent }: submitTrixtaFunctionParameters) => {
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

  const isInProgress = useSelector((state: RootState) =>
    selectReactionInProgress(state, reactionRoleProps),
  );

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
    submitTrixtaReaction,
  };
};