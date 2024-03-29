import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
import { submitTrixtaReactionResponse } from '../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../TrixtaDebugger';
import { DefaultUnknownType, TrixtaState } from '../../types/common';
import {
  TrixtaReactionBaseProps,
  TrixtaReactionInstance,
} from '../../types/reactions';
import {
  RespondToReactionFunctionParameters,
  UseRespondToReactionResponseHookReturn,
  UseRespondToReactionResponseProps,
} from './types';

export const useRespondToReactionResponse = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = DefaultUnknownType
>({
  roleName,
  reactionName,
  debugMode = false,
}: UseRespondToReactionResponseProps): UseRespondToReactionResponseHookReturn => {
  const dispatch = useDispatch();
  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  if (isNullOrEmpty(reactionName)) {
    throw Error('Please provide reactionName parameter.');
  }
  const respondedInstanceRef = useRef<string | undefined>();
  const selectReactionResponses = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  const selectHasRoleAccess = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const reactionRoleProps = {
    roleName,
    requestForEffect: false,
    reactionName,
  } as TrixtaReactionBaseProps;
  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaReactionInstance<
      TInitialData,
      DefaultUnknownType,
      DefaultUnknownType
    >[]
  >(
    (state: { trixta: TrixtaState }) =>
      selectReactionResponses(
        state,
        reactionRoleProps,
      ) as TrixtaReactionInstance<
        TInitialData,
        DefaultUnknownType,
        DefaultUnknownType
      >[],
  );
  const [latest] = instances;
  const latestInstance = latest;
  const hasRoleAccess = useSelector((state: { trixta: TrixtaState }) =>
    selectHasRoleAccess(state, { roleName }),
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

  useEffect(() => {
    respondedInstanceRef.current = undefined;
  }, []);

  const respondToReaction = useCallback(
    ({
      data,
      instance,
      responseEvent,
      errorEvent,
    }: RespondToReactionFunctionParameters) => {
      if (!hasRoleAccess) return;
      if (!instance) return;
      if (!instance.details) return;
      if (!instance.details.ref) return;
      if (instance.details.status === 'expired') return;
      if (
        respondedInstanceRef.current !== undefined &&
        respondedInstanceRef.current === instance.details.ref
      )
        return;
      respondedInstanceRef.current = instance.details.ref;
      dispatch(
        submitTrixtaReactionResponse({
          formData: data ?? {},
          ref: instance.details.ref,
          roleName,
          responseEvent,
          errorEvent,
          reactionName,
        }),
      );
    },
    [dispatch, roleName, reactionName, hasRoleAccess],
  );

  return {
    latestInstance,
    hasRoleAccess,
    respondToReaction,
  };
};
