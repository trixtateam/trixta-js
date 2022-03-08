import {
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE,
} from '../../../constants';
import { AdditionalTrixtaData } from '../types';

export type AdditionalReactionTrixtaDataType = {
  extraData?: Record<string, unknown>;
  trixtaMeta: AdditionalTrixtaData & {
    reactionName: string;
    ref?: string;
  };
};

export type SubmitTrixtaReactionResponseFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: AdditionalReactionTrixtaDataType;
};

export type SubmitTrixtaReactionResponseTimeoutFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_TIMEOUT_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: AdditionalReactionTrixtaDataType;
};

export type SubmitTrixtaReactionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS;
  additionalData: AdditionalReactionTrixtaDataType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
