import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole
} from '../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../TrixtaDebugger';
import { defaultUnknownType } from '../types';
import {
  RootState,

  TrixtaReactionBaseProps,
  TrixtaReactionInstance
} from './../types';
import { UseRespondToReactionEffectProps, UseRespondToReactionEffectReturn } from './types';

export const useRespondToReactionEffect = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = defaultUnknownType
>(
  props: UseRespondToReactionEffectProps,
): UseRespondToReactionEffectReturn => {
  const { actionToDispatch, dispatchResponseTo, roleName, debugMode = false, reactionName } = props;
  const actionRef = useRef(actionToDispatch);
  const dispatch = useDispatch();
  const selectReactionResponse: any = useMemo(makeSelectTrixtaReactionResponseInstancesForRole, []);
  const selectHasRoleAccess: any = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const reactionRoleProps = {
    roleName,
    requestForEffect: true,
    reactionName,
  } as TrixtaReactionBaseProps;
  const instances = useSelector<
    RootState,
    TrixtaReactionInstance<TInitialData, defaultUnknownType, defaultUnknownType>[]
  >((state: RootState) => selectReactionResponse(state, reactionRoleProps));
  const hasRoleAccess = useSelector<RootState, boolean>((state: RootState) =>
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
    actionRef.current = actionToDispatch;
  }, [actionToDispatch]);

  useEffect(() => {
    if (!hasRoleAccess) return;
    if (Array.isArray(instances) && instances.length) {
      const latestInstance = instances[0];
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
