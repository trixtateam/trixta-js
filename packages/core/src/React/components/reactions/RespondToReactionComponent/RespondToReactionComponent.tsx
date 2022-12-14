import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { isNullOrEmpty } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../../selectors';
import { DefaultUnknownType, TrixtaState } from '../../../types/common';
import { RespondToReactionComponentProps } from './types';

/**
 * React component used to respond to a Trixta reaction effect or response when shouldRespond is true,
 * by dispatching the response / initialData to actionToDispatch or dispatchResponseTo props.
 * @param props
 * @param props.roleName - trixta role name
 * @param props.reactionName -  trixta reaction name
 * @param props.actionToDispatch = undefined] props.actionToDispatch - function to dispatch when response from trixta reaction
 * @param props.dispatchResponseTo - action name to dispatch response from trixta reaction
 * @param props.requestForEffect = true] props.requestForEffect - determines if trixta reaction is a requestForResponse or requestForEffect
 *
 */
function RespondToReactionComponent<TInitialData = DefaultUnknownType>({
  roleName,
  reactionName,
  requestForEffect = true,
  hasRoleAccess,
  instances,
  formData = {},
  shouldRespond = true,
  actionToDispatch = undefined,
  dispatchResponseTo,
}: RespondToReactionComponentProps<TInitialData> & ConnectProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hasRoleAccess) return;
    if (!shouldRespond) return;
    if (!isNullOrEmpty(instances) && Array.isArray(instances)) {
      const latestInstance = instances[0];
      if (dispatchResponseTo) {
        dispatch({
          type: dispatchResponseTo,
          payload: latestInstance?.details?.initial_data,
        });
      }
      if (actionToDispatch) {
        dispatch(
          actionToDispatch(
            latestInstance?.details?.initial_data as TInitialData,
          ),
        );
      }
      const isRequestForEffect =
        requestForEffect === undefined && requestForEffect !== false
          ? true
          : false;
      if (!isRequestForEffect && !actionToDispatch && !dispatchResponseTo) {
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
}

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstancesForRole = makeSelectTrixtaReactionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: RespondToReactionComponentProps,
  ) => {
    return {
      instances: getTrixtaReactionResponseInstancesForRole(state, props),
      hasRoleAccess: getHasTrixtaRoleAccess(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(RespondToReactionComponent);
