import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../selectors';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trixtaDebugger, TrixtaDebugType } from '../TrixtaDebugger';
import { TrixtaInstance, TrixtaState } from './../types';
import {
  RespondToReactionFunctionParameters,
  UseRespondToReactionResponseProps,
  UseRespondToReactionResponseReturn,
} from './types';
import { submitTrixtaReactionResponse } from '../reduxActions';

export const useRespondToReactionResponse = ({
  roleName,
  reactionName,
  debugMode = false,
}: UseRespondToReactionResponseProps): UseRespondToReactionResponseReturn => {
  const dispatch = useDispatch();
  const respondedInstanceRef = useRef<string | undefined>();
  const selectReactionResponses = useMemo<
    ReturnType<typeof makeSelectTrixtaReactionResponseInstancesForRole>
  >(makeSelectTrixtaReactionResponseInstancesForRole, []);
  const selectHasRoleAccess = useMemo<ReturnType<typeof makeSelectHasTrixtaRoleAccess>>(
    makeSelectHasTrixtaRoleAccess,
    [],
  );
  const instances = useSelector<TrixtaState, TrixtaInstance[]>((state) =>
    selectReactionResponses(state, {
      roleName,
      reactionName,
      requestForEffect: false,
    }),
  );
  const [latest] = instances;
  const latestInstance = latest;
  const hasRoleAccess = useSelector((state) => selectHasRoleAccess(state, { roleName }));

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
    ({ data, instance, responseEvent, errorEvent }: RespondToReactionFunctionParameters) => {
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
