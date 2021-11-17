import {
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
} from '../../../constants';
import { AdditionalTrixtaData } from '../types';

export type SubmitTrixtaReactionResponseFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      ref?: string;
      reactionName: string;
    };
  };
};

export type SubmitTrixtaReactionResponseTimeoutFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      ref?: string;
      reactionName: string;
    };
  };
};

export type SubmitTrixtaReactionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      ref?: string;
      reactionName: string;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
