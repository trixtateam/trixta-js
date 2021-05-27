import {
  CLEAR_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
  UPDATE_TRIXTA_ACTION,
  UPDATE_TRIXTA_ACTION_RESPONSE,
} from './../constants/actions/index';
import {
  JOIN_TRIXTA_ROLE,
  REMOVE_TRIXTA_ROLE,
  SIGN_OUT_TRIXTA,
  UPDATE_TRIXTA_ERROR,
  UPDATE_TRIXTA_ROLE,
  UPDATE_TRIXTA_ROLES,
} from './../constants/index';
import {
  CLEAR_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
  TRIXTA_REACTION_RESPONSE,
  UPDATE_TRIXTA_REACTION,
  UPDATE_TRIXTA_REACTION_RESPONSE,
} from './../constants/reactions/index';
import {
  DefaultUnknownType,
  TrixtaActionDebugOptions,
  TrixtaActionDetails,
  TrixtaActionResponseDetails,
  TrixtaReactionDetails,
  TrixtaReactionResponseDetails,
  TrixtaRoleParameter,
} from './../types';

export type SignoutTrixtaAction = {
  type: typeof SIGN_OUT_TRIXTA;
};

export type UpdateTrixtaErrorAction = {
  type: typeof UPDATE_TRIXTA_ERROR;
  error: unknown;
};

export type JoinTrixtaRoleAction = {
  type: typeof JOIN_TRIXTA_ROLE;
  data: {
    roleName: string;
  };
};

export type RemoveTrixtaRoleAction = {
  type: typeof REMOVE_TRIXTA_ROLE;
  data: {
    role: {
      name: string;
    };
  };
};

export type UpdateTrixtaRoleAction = {
  type: typeof UPDATE_TRIXTA_ROLE;
  data: {
    role: TrixtaRoleParameter;
  };
};

export type UpdateTrixtaRolesAction = {
  type: typeof UPDATE_TRIXTA_ROLES;
  data: {
    roles: Array<TrixtaRoleParameter>;
  };
};

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
    reaction: TrixtaReactionResponseDetails;
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
    role: string;
    keyName: string;
    reaction: TrixtaReactionDetails;
    name: string;
  };
};

export type ClearTrixtaReactionResponseAction = {
  type: typeof CLEAR_TRIXTA_REACTION_RESPONSE;
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
  error: {
    roleName: string;
    reactionName: string;
  };
  data: {
    roleName: string;
    reactionName: string;
    ref?: string;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type SubmitTrixtaReactionResponseSuccessAction = {
  type: typeof SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS;
  data:
    | {
        roleName: string;
        reactionName: string;
        responseEvent?: string;
        errorEvent?: string;
      }
    | TrixtaReactionResponseDetails;
};

export type UpdateTrixtaActionDetailsAction = {
  type: typeof UPDATE_TRIXTA_ACTION;
  data: {
    role: string;
    keyName: string;
    action: TrixtaActionDetails;
    name: string;
  };
};

export type UpdateTrixtaActionResponseAction = {
  type: typeof UPDATE_TRIXTA_ACTION_RESPONSE;
  data: {
    clearResponse: boolean;
    roleName: string;
    actionName: string;
    response: TrixtaActionResponseDetails;
    keyName: string;
  };
};

export type ClearTrixtaActionResponseAction = {
  type: typeof CLEAR_TRIXTA_ACTION_RESPONSE;
  data: {
    roleName: string;
    actionName: string;
  };
};

export type SubmitTrixtaActionResponseAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE;
  data: {
    formData: DefaultUnknownType;
    roleName: string;
    debugMode: boolean;
    clearResponse: boolean;
    actionOptions: Record<string, unknown>;
    debugOptions: TrixtaActionDebugOptions;
    actionName: string;
    requestEvent?: string;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type SubmitTrixtaActionResponsSuccesseAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS;
  data: {
    roleName: string;
    actionName: string;
    clearResponse?: boolean;
    responseEvent?: string;
    errorEvent?: string;
  } & TrixtaActionResponseDetails;
};

export type SubmitTrixtaActionResponsFailureAction = {
  type: typeof SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE;
  error: any;
  data?: {
    roleName: string;
    actionName: string;
    clearResponse?: boolean;
    responseEvent?: string;
    errorEvent?: string;
  };
};

export type TrixtaReducerActions =
  | UpdateTrixtaActionResponseAction
  | UpdateTrixtaRolesAction
  | JoinTrixtaRoleAction
  | UpdateTrixtaRoleAction
  | SignoutTrixtaAction
  | RemoveTrixtaRoleAction
  | UpdateTrixtaErrorAction
  | SubmitTrixtaReactionResponseFailureAction
  | SubmitTrixtaReactionResponseSuccessAction
  | SubmitTrixtaActionResponsSuccesseAction
  | SubmitTrixtaActionResponsFailureAction
  | UpdateTrixtaReactionResponseAction
  | UpdateTrixtaReactionDetailsAction
  | UpdateTrixtaActionDetailsAction
  | ClearTrixtaActionResponseAction
  | SubmitTrixtaActionResponseAction
  | ClearTrixtaReactionResponseAction
  | SubmitTrixtaReactionResponseAction;
