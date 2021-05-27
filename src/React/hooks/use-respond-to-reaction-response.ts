import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTrixtaReactionResponse } from '../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../TrixtaDebugger';
import { TrixtaReactionBaseProps } from './../types';
import {
  defaultUnknownType,
  TrixtaReactionInstance,
  TrixtaState,
} from './../types/common/index';
import {
  RespondToReactionFunctionParameters,
  UseRespondToReactionResponseProps,
  UseRespondToReactionResponseReturn,
} from './types';

export const useRespondToReactionResponse = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = defaultUnknownType
>({
  roleName,
  reactionName,
  debugMode = false,
}: UseRespondToReactionResponseProps): UseRespondToReactionResponseReturn => {
  const dispatch = useDispatch();
  const respondedInstanceRef = useRef<string | undefined>();
  const selectReactionResponses = useMemo<
    ReturnType<typeof makeSelectTrixtaReactionResponseInstancesForRole>
  >(makeSelectTrixtaReactionResponseInstancesForRole, []);
  const selectHasRoleAccess = useMemo<
    ReturnType<typeof makeSelectHasTrixtaRoleAccess>
  >(makeSelectHasTrixtaRoleAccess, []);
  const reactionRoleProps = {
    roleName,
    requestForEffect: false,
    reactionName,
  } as TrixtaReactionBaseProps;
  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaReactionInstance<
      TInitialData,
      defaultUnknownType,
      defaultUnknownType
    >[]
  >((state: { trixta: TrixtaState }) =>
    selectReactionResponses(state, reactionRoleProps),
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
