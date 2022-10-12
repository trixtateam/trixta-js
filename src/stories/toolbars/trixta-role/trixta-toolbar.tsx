import { useGlobals } from '@storybook/api';
import {
  IconButton,
  Icons,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/components';
import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { useTrixtaData } from '../../../main/React/hooks/use-trixta-data/use-trixta-data';
import store from '../../store';
import {
  TOOL_ACTION_ID,
  TOOL_REACTION_ID,
  TOOL_ROLE_ID,
  TRIXTA_ACTION_KEY,
  TRIXTA_REACTION_KEY,
  TRIXTA_ROLE_KEY,
} from './constants';
export const TrixtaRoleToolbar = () => {
  const [globals, updateGlobals] = useGlobals();

  const trixtaRoleName = globals[TRIXTA_ROLE_KEY] || undefined;
  const trixtaActionName = globals[TRIXTA_ACTION_KEY] || undefined;
  const trixtaReactionName = globals[TRIXTA_REACTION_KEY] || undefined;
  const { setRole, roles, actionNameList, reactionNameList } = useTrixtaData({
    roleName: trixtaRoleName,
  });
  const setSelectedRole = useCallback((role) => {
    setRole(role);
    updateGlobals({
      [TRIXTA_ROLE_KEY]: role,
    });
    updateGlobals({
      [TRIXTA_ACTION_KEY]: actionNameList[0],
    });
    updateGlobals({
      [TRIXTA_REACTION_KEY]: reactionNameList[0],
    });
  }, []);
  const setSelectedAction = useCallback((actionName) => {
    updateGlobals({
      [TRIXTA_ACTION_KEY]: actionName,
    });
  }, []);

  const setSelectedReaction = useCallback((reactionName) => {
    updateGlobals({
      [TRIXTA_REACTION_KEY]: reactionName,
    });
  }, []);

  return (
    <>
      <WithTooltip
        placement="bottom"
        trigger="click"
        tooltipShown
        closeOnClick
        tooltip={({ onHide }) => {
          const onClick = (selectedId: string) => {
            setSelectedRole(selectedId);
            onHide();
          };
          const selectorItems = roles.map((role) => ({
            id: role,
            title: role,
            onClick: () => onClick(role),
            value: role,
            active: role === trixtaRoleName,
          }));
          return <TooltipLinkList links={selectorItems} />;
        }}
      >
        <IconButton
          key={TOOL_ROLE_ID}
          title={'Select a Trixta Role'}
          active={!!trixtaRoleName}
        >
          {trixtaRoleName ? (
            <>
              <Icons icon="user" style={{ marginRight: 6 }} />
              {trixtaRoleName}
            </>
          ) : (
            <Icons icon="user" />
          )}
        </IconButton>
      </WithTooltip>
      {trixtaRoleName && (
        <WithTooltip
          placement="bottom"
          trigger="click"
          tooltipShown
          closeOnClick
          tooltip={({ onHide }) => {
            const onClick = (selectedId: string) => {
              setSelectedAction(selectedId);
              onHide();
            };
            const selectorItems = actionNameList.map((action) => ({
              id: action,
              title: action,
              onClick: () => onClick(action),
              value: action,
              active: action === trixtaActionName,
            }));
            return <TooltipLinkList links={selectorItems} />;
          }}
        >
          <IconButton
            key={TOOL_ACTION_ID}
            title={`Select a Trixta Action for ${trixtaRoleName}`}
            active={!!trixtaActionName}
          >
            {trixtaActionName ? (
              <>
                <Icons icon="arrowright" style={{ marginRight: 6 }} />
                {trixtaActionName}
              </>
            ) : (
              <Icons icon="arrowright" />
            )}
          </IconButton>
        </WithTooltip>
      )}
      {trixtaRoleName && (
        <WithTooltip
          placement="bottom"
          trigger="click"
          tooltipShown
          closeOnClick
          tooltip={({ onHide }) => {
            const onClick = (selectedId: string) => {
              setSelectedReaction(selectedId);
              onHide();
            };
            const selectorItems = reactionNameList.map((reaction) => ({
              id: reaction,
              title: reaction,
              onClick: () => onClick(reaction),
              value: reaction,
              active: reaction === trixtaReactionName,
            }));
            return <TooltipLinkList links={selectorItems} />;
          }}
        >
          <IconButton
            key={TOOL_REACTION_ID}
            title={`Select a Trixta Reaction for ${trixtaRoleName}`}
            active={!!trixtaReactionName}
          >
            {trixtaReactionName ? (
              <>
                <Icons icon="arrowleft" style={{ marginRight: 6 }} />
                {trixtaReactionName}
              </>
            ) : (
              <Icons icon="arrowleft" />
            )}
          </IconButton>
        </WithTooltip>
      )}
    </>
  );
};

export const TrixtaRoleToolbarWrapper = () => {
  return (
    <Provider store={store}>
      <TrixtaRoleToolbar />
    </Provider>
  );
};

export default TrixtaRoleToolbarWrapper;
