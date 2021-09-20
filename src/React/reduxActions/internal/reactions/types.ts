import {
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
} from '../../../constants';

export type SubmitTrixtaReactionResponseFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    ref?: string;
    roleName: string;
    reactionName: string;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type SubmitTrixtaReactionResponseTimeoutFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    ref?: string;
    roleName: string;
    reactionName: string;
    responseEvent?: string;
    timeoutEvent?: string;
  };
};

export type SubmitTrixtaReactionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS;
  additionalData: {
    ref?: string;
    roleName: string;
    reactionName: string;
    responseEvent?: string;
    errorEvent?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
