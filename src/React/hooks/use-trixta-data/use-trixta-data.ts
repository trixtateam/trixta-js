import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TrixtaState } from '../..';
import {
  makeSelectTrixtaActionsForRole,
  makeSelectTrixtaAgentDetails,
  makeSelectTrixtaReactionsForRole,
} from '../../selectors';
import { UseTrixtaDataHookReturn, UseTrixtaDataProps } from './types';

export const useTrixtaData = ({
  roleName = 'everyone_anon',
}: UseTrixtaDataProps = {}): UseTrixtaDataHookReturn => {
  const [selectedRoleName, setRole] = useState<string>(roleName);
  const [selectedActionName, setSelectedAction] = useState<
    string | undefined
  >();
  const [selectedReactionName, setSelectedReaction] = useState<
    string | undefined
  >();

  const selectTrixtaRoles = useMemo(makeSelectTrixtaAgentDetails, []);
  const roles = useSelector<{ trixta: TrixtaState }, string[]>((state) =>
    selectTrixtaRoles(state),
  );
  const selectTrixtaActions = useMemo(makeSelectTrixtaActionsForRole, []);
  const actions = useSelector<
    { trixta: TrixtaState },
    ReturnType<typeof selectTrixtaActions>
  >((state) => selectTrixtaActions(state, { roleName: selectedRoleName }));
  const actionNameList = actions
    ? actions.map<string>((action) => action.common.name)
    : [];
  const selectTrixtaReactions = useMemo(makeSelectTrixtaReactionsForRole, []);
  const reactions = useSelector<
    { trixta: TrixtaState },
    ReturnType<typeof selectTrixtaReactions>
  >((state) => selectTrixtaReactions(state, { roleName: selectedRoleName }));
  const reactionNameList = reactions
    ? reactions.map<string>((reaction) => reaction.common.name)
    : [];

  return {
    selectedRoleName,
    setRole,
    roles,
    reactions,
    actions,
    reactionNameList,
    actionNameList,
    selectedActionName,
    selectedReactionName,
    setSelectedAction,
    setSelectedReaction,
  };
};
