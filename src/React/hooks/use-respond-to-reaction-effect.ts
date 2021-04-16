import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../TrixtaDebugger';
import { RootState, TrixtaInstance, TrixtaReactionBaseProps } from './../types';
import { UseRespondToReactionEffectProps, UseRespondToReactionEffectReturn } from './types';

export const useRespondToReactionEffect = (
  props: UseRespondToReactionEffectProps,
): UseRespondToReactionEffectReturn => {
  const { actionToDispatch, dispatchResponseTo, roleName, debugMode = false, reactionName } = props;
  const actionRef = useRef(actionToDispatch);
  const dispatch = useDispatch();
  const selectReactionResponse = useMemo<
    ReturnType<typeof makeSelectTrixtaReactionResponseInstancesForRole>
  >(makeSelectTrixtaReactionResponseInstancesForRole, []);
  const selectHasRoleAccess = useMemo<ReturnType<typeof makeSelectHasTrixtaRoleAccess>>(
    makeSelectHasTrixtaRoleAccess,
    [],
  );
  const reactionRoleProps = {
    roleName,
    requestForEffect: true,
    reactionName,
  } as TrixtaReactionBaseProps;
  const instances = useSelector((state: RootState) =>
    selectReactionResponse(state, reactionRoleProps),
  );
  const hasRoleAccess = useSelector((state: RootState) => selectHasRoleAccess(state, { roleName }));

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
    actionRef.current = actionToDispatch;
  }, [actionToDispatch]);

  useEffect(() => {
    if (!hasRoleAccess) return;
    if (Array.isArray(instances) && instances.length) {
      const latestInstance = instances[0] as TrixtaInstance;
      if (dispatchResponseTo) {
        dispatch({
          type: dispatchResponseTo,
          data: latestInstance?.details?.initial_data,
        });
      }
      if (actionRef.current) {
        dispatch(actionRef.current(latestInstance?.details?.initial_data));
      }
    }
  }, [dispatch, hasRoleAccess, instances, dispatchResponseTo]);

  return { hasRoleAccess };
};
