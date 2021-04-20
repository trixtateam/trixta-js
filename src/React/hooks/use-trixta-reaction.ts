import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTrixtaReactionResponse } from '../reduxActions/trixtaReactions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaReactionInProgress,
  makeSelectTrixtaReactionResponseInstancesForRole
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType, trixtaInstanceDebugger } from '../TrixtaDebugger';
import {
  defaultUnknownType,
  RootState,
  TrixtaReactionBaseProps,
  TrixtaReactionInstance
} from './../types';
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

  const selectHasRoleAccess: any = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const hasRoleAccess = useSelector<RootState, boolean>((state) =>
    selectHasRoleAccess(state, { roleName }),
  );
  const reactionRoleProps = { roleName, requestForEffect, reactionName } as TrixtaReactionBaseProps;
  const selectReactionResponses: any = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  const selectReactionInProgress: any = useMemo(makeSelectIsTrixtaReactionInProgress, []);
  const isInProgress = useSelector<RootState, boolean>((state: RootState) =>
    selectReactionInProgress(state, reactionRoleProps),
  );

  const instances = useSelector<
    RootState,
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
