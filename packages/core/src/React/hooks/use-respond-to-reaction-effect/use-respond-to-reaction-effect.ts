import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '../../../utils';
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
  UseRespondToReactionEffectHookReturn,
  UseRespondToReactionEffectProps,
} from './types';

export const useRespondToReactionEffect = <
  /**
   * Type for initial data from Trixta Reaction
   */
  TInitialData = DefaultUnknownType
>(
  props: UseRespondToReactionEffectProps<TInitialData>,
): UseRespondToReactionEffectHookReturn => {
  const {
    actionToDispatch,
    dispatchResponseTo,
    roleName,
    callBack,
    debugMode = false,
    reactionName,
  } = props;
  const actionRef = useRef(actionToDispatch);
  const callBackRef = useRef(callBack);
  const lastInstanceKey = useRef<string | undefined>(undefined);
  const dispatch = useDispatch();

  if (isNullOrEmpty(roleName)) {
    throw Error('Please provide roleName parameter.');
  }

  if (isNullOrEmpty(reactionName)) {
    throw Error('Please provide reactionName parameter.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectReactionResponse: any = useMemo(
    makeSelectTrixtaReactionResponseInstancesForRole,
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectHasRoleAccess: any = useMemo(makeSelectHasTrixtaRoleAccess, []);
  const reactionRoleProps = {
    roleName,
    requestForEffect: true,
    reactionName,
  } as TrixtaReactionBaseProps;
  const instances = useSelector<
    { trixta: TrixtaState },
    TrixtaReactionInstance<
      TInitialData,
      DefaultUnknownType,
      DefaultUnknownType
    >[]
  >((state: { trixta: TrixtaState }) =>
    selectReactionResponse(state, reactionRoleProps),
  );
  const hasRoleAccess = useSelector<{ trixta: TrixtaState }, boolean>(
    (state: { trixta: TrixtaState }) =>
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
    callBackRef.current = callBack;
  }, [callBack]);

  useEffect(() => {
    if (!hasRoleAccess) return;
    if (Array.isArray(instances) && instances.length) {
      const latestInstance = instances[0];

      if (dispatchResponseTo) {
        dispatch({
          type: dispatchResponseTo,
          payload: latestInstance?.details?.initial_data,
        });
      }

      if (actionRef.current) {
        dispatch(actionRef.current(latestInstance?.details?.initial_data));
      }

      if (
        latestInstance &&
        lastInstanceKey.current !== latestInstance.instanceKey &&
        callBackRef.current
      ) {
        lastInstanceKey.current = latestInstance.instanceKey;
        callBackRef.current(latestInstance?.details?.initial_data);
      }
    }
  }, [dispatch, hasRoleAccess, instances, dispatchResponseTo]);

  return { hasRoleAccess };
};
