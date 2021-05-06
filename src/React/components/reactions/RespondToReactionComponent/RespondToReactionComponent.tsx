import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { isNullOrEmpty } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../../selectors';
import { DefaultUnknownType, TrixtaState } from './../../../types/common';
import { TrixtaReactionInstance } from './../../../types/reactions';
import { RespondToReactionComponentProps } from './types';

const RespondToReactionComponent = ({
  roleName,
  reactionName,
  requestForEffect = true,
  hasRoleAccess,
  instances,
  formData = {},
  shouldRespond = true,
  actionToDispatch = undefined,
  dispatchResponseTo,
}: RespondToReactionComponentProps & ConnectProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hasRoleAccess) return;
    if (!shouldRespond) return;
    if (!isNullOrEmpty(instances) && Array.isArray(instances)) {
      const latestInstance = instances[0];
      if (dispatchResponseTo) {
        dispatch({
          type: dispatchResponseTo,
          data: latestInstance?.details?.initial_data,
        });
      }
      if (actionToDispatch) {
        dispatch(actionToDispatch(latestInstance?.details?.initial_data));
      }
      if (!requestForEffect && !actionToDispatch && !dispatchResponseTo) {
        dispatch(
          submitTrixtaReactionResponse({
            formData,
            ref: latestInstance?.details.ref,
            roleName,
            reactionName,
          }),
        );
      }
    }
  }, [
    roleName,
    reactionName,
    hasRoleAccess,
    dispatch,
    instances,
    shouldRespond,
    requestForEffect,
    formData,
    dispatchResponseTo,
    actionToDispatch,
  ]);
  return null;
};

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstancesForRole = makeSelectTrixtaReactionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: RespondToReactionComponentProps,
  ) => {
    return {
      instances: getTrixtaReactionResponseInstancesForRole(
        state,
        props,
      ) as TrixtaReactionInstance<
        DefaultUnknownType,
        DefaultUnknownType,
        DefaultUnknownType
      >[],
      hasRoleAccess: getHasTrixtaRoleAccess(state, props) as boolean,
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect<
  ConnectProps,
  Record<string, unknown>,
  RespondToReactionComponentProps,
  { trixta: TrixtaState }
>(makeMapStateToProps);

export default connector(RespondToReactionComponent);
