import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE,
} from '../../../constants';
import { AdditionalTrixtaData } from '../types';

export type SubmitTrixtaActionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      actionName: string;
    };
  };
};

export type SubmitTrixtaActionResponseFailureAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      actionName: string;
    };
  };
};

export type SubmitTrixtaActionResponseTimeoutFailureAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_TIMEOUT_RESPONSE_FAILURE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  additionalData: {
    extraData?: Record<string, unknown>;
    trixtaMeta: AdditionalTrixtaData & {
      actionName: string;
    };
  };
};
