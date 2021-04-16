import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isNullOrEmpty } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole
} from '../../../selectors';
import { RootState, TrixtaReactionBaseProps } from '../../../types';
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
}: RespondToReactionComponentProps) => {
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

const mapStateToProps = () =>
  createStructuredSelector<RootState, TrixtaReactionBaseProps>({
    instances: makeSelectTrixtaReactionResponseInstancesForRole(),
    hasRoleAccess: makeSelectHasTrixtaRoleAccess(),
  });

const connector = connect(mapStateToProps, null);

export default connector(RespondToReactionComponent);
