import {
  SubmitTrixtaReactionResponseFailureAction,
  SubmitTrixtaReactionResponseSuccessAction,
  SubmitTrixtaReactionResponseTimeoutFailureAction,
} from '../internal/reactions/types';
import {
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from './../../constants/reactions/index';
import { DefaultUnknownType } from './../../types/common';
import {
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails,
} from './../../types/reactions';

export type EmitTrixtaReactionResponseListenerEventAction<
  TInitialData = DefaultUnknownType
> = {
  type: string;
  meta: {
    roleName: string;
    reactionName: string;
  };
  payload: {
    reactionDetails: TrixtaReactionResponseDetails<TInitialData>;
  };
};

export type UpdateTrixtaReactionResponseAction = {
  type: typeof UPDATE_TRIXTA_REACTION_RESPONSE;
  payload: {
    roleName: string;
    reactionName: string;
    reactionResponse: TrixtaReactionResponseDetails;
    keyName: string;
  };
};

export type IncomingTrixtaReactionAction = {
  type: typeof TRIXTA_REACTION_RESPONSE;
  data: TrixtaReactionResponseDetails;
  eventName: string;
  channelTopic: string;
};

export type UpdateTrixtaReactionDetailsAction = {
  type: typeof UPDATE_TRIXTA_REACTION;
  payload: {
    keyName: string;
    trixtaReaction: TrixtaReactionDetails;
  };
};

export type ClearTrixtaReactionResponseAction = {
  type: typeof CLEAR_TRIXTA_REACTION_RESPONSE;
  payload: {
    roleName: string;
    reactionName: string;
    loadingStatusRef?: string;
  };
};

export type ClearTrixtaReactionRequestStatusAction = {
  type: typeof CLEAR_TRIXTA_REACTION_REQUEST_STATUS;
  payload: {
    roleName: string;
    reactionName: string;
    loadingStatusRef?: string;
  };
};

export type SubmitTrixtaReactionResponseAction<TFormData = never> = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE;
  payload: {
    formData?: TFormData;
    extraData?: Record<string, unknown>;
    ref?: string;
    loadingStatusRef?: string;
    responseEvent?: string;
    requestEvent?: string;
    errorEvent?: string;
    timeoutEvent?: string;
    timeout?: number;
    roleName: string;
    reactionName: string;
  };
};

export type TrixtaReactionReducerActions =
  | SubmitTrixtaReactionResponseFailureAction
  | SubmitTrixtaReactionResponseTimeoutFailureAction
  | ClearTrixtaReactionRequestStatusAction
  | SubmitTrixtaReactionResponseSuccessAction
  | UpdateTrixtaReactionResponseAction
  | UpdateTrixtaReactionDetailsAction
  | ClearTrixtaReactionResponseAction
  | SubmitTrixtaReactionResponseAction;
