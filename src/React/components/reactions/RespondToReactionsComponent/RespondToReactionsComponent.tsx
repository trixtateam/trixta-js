import React from 'react';
import { RespondToReactionComponent } from '../RespondToReactionComponent';
import { RespondToReactionsComponentProps } from './types';

/**
 *
 * @param props
 * @param props.roleName - trixta role name
 * @param props.reactions - trixta reactions
 * @param props.reactions[].name - trixta reaction name
 * @param props.reactions[].actionToDispatch = undefined] props.reactions[].actionToDispatch - function to dispatch when response from trixta reaction
 * @param props.reactions[].dispatchResponseTo - action name to dispatch response from trixta reaction
 * @param props.reactions[].requestForEffect = true] props.reactions[].requestForEffect - determines if trixta reaction is a requestForResponse or requestForEffect
 */
export const RespondToReactionsComponent = ({
  roleName,
  reactions,
}: RespondToReactionsComponentProps): JSX.Element => (
  <>
    {reactions.map((reaction) => (
      <RespondToReactionComponent
        key={`${roleName}-${reaction.reactionName}`}
        roleName={roleName}
        requestForEffect={reaction.requestForEffect ?? true}
        reactionName={reaction.reactionName}
        actionToDispatch={reaction.actionToDispatch}
        dispatchResponseTo={reaction.dispatchResponseTo}
      />
    ))}
  </>
);
