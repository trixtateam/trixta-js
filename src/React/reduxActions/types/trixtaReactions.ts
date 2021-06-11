import {
  CLEAR_TRIXTA_REACTION_REQUEST_STATUS,
  CLEAR_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE
} from './../../constants/reactions/index';
import {
  DefaultUnknownType
} from './../../types/common';
import {
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails
} from './../../types/reactions';

export type EmitTrixtaReactionResponseListenerEventAction<
  TInitialData = DefaultUnknownType
> = {
  type: string;
  meta: {
    roleName: string;
    reactionName: string;
  };
  data: {
    reactionDetails: TrixtaReactionResponseDetails<TInitialData>;
  };
};

export type UpdateTrixtaReactionResponseAction = {
  type: typeof UPDATE_TRIXTA_REACTION_RESPONSE;
  data: {
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
  data: {
    keyName: string;
    trixtaReaction: TrixtaReactionDetails;
  };
};

export type ClearTrixtaReactionResponseAction = {
  type: typeof CLEAR_TRIXTA_REACTION_RESPONSE;
  data: {
    roleName: string;
    reactionName: string;
  };
};

export type ClearTrixtaReactionRequestStatusAction = {
  type: typeof CLEAR_TRIXTA_REACTION_REQUEST_STATUS;
  data: {
    roleName: string;
    reactionName: string;
  };
};

export type SubmitTrixtaReactionResponseAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE;
  data: {
    formData: DefaultUnknownType;
    ref: string;
    responseEvent?: string;
    requestEvent?: string;
    errorEvent?: string;
    roleName: string;
    reactionName: string;
  };
};

export type SubmitTrixtaReactionResponseFailureAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE;
  error: any;
  additionalData:{
    ref?: string;
    roleName: string;
    reactionName: string;
    responseEvent?: string;
    errorEvent?: string;
  },
};

export type SubmitTrixtaReactionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS;
  additionalData:{
    ref?: string;
    roleName: string;
    reactionName: string;
    responseEvent?: string;
    errorEvent?: string;
  }
  data: any;
};


export type TrixtaReactionReducerActions =
  | SubmitTrixtaReactionResponseFailureAction
  | ClearTrixtaReactionRequestStatusAction
  | SubmitTrixtaReactionResponseSuccessAction
  | UpdateTrixtaReactionResponseAction
  | UpdateTrixtaReactionDetailsAction
  | ClearTrixtaReactionResponseAction
  | SubmitTrixtaReactionResponseAction;
