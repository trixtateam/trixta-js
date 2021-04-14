export enum TrixtaReactionType {
  requestForEffect = 'requestForEffect',
  requestForResponse = 'requestForResponse',
}

export enum TrixtaDataType {
  action = 'action',
  reaction = 'reaction',
}

export interface TrixtaReactionResponseDetails<TInitialData = defaultUnknownType> {
  id?: string;
  settings?: unknown;
  errorEvent?: string;
  responseEvent?: string;
  type: TrixtaReactionType;
  initial_data: TInitialData;
  data_schema?: unknown;
  name?: string;
  ref: string;
  status: string;
  eventName?: string;
  dateCreated: string;
}

export interface TrixtaReactionDetails {
  name: string;
  notes: string;
  role_id: string;
  request_schema: unknown;
  request_settings: unknown;
  description: string;
  tags: Array<string>;
}

export interface TrixtaActionHandlerType {
  type: string;
  name: string;
  func?: string;
  engine?: string;
}

export interface TrixtaActionDetails<TFormData = defaultUnknownType> {
  name: string;
  notes: string;
  role_id: string;
  form_data: TFormData;
  response_schema: unknown;
  request_schema: unknown;
  request_settings: unknown;
  description: string;
  handler: TrixtaActionHandlerType;
  tags: Array<string>;
}

export interface TrixtaActionResponseDetails<TInitialData = defaultUnknownType> {
  id: string;
  settings: unknown;
  initial_data: TInitialData;
  data_schema: unknown;
  name: string;
  status: string;
  eventName: string;
  dateCreated: string;
}

export interface TrixtaRoleParameter {
  name: string;
  logPresence?: boolean;
}

export interface TrixtaRole {
  name: string;
}

export type defaultUnknownType =
  | Record<string, unknown>
  | Array<Record<string, unknown> | unknown>
  | unknown
  | undefined
  | string
  | boolean;

export interface TrixtaAuthProps {
  /**
   * Trixta roles or role name
   */
  roles?: string | string[];
}

export interface TrixtaReactionDispatch {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;

  /**
   * Redux Action creator function to pass data to from Trixta reaction response
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  actionToDispatch?: Function;
  /**
   * Redux Action event to pass data to from Trixta reaction response
   */
  dispatchResponseTo?: string;
}

export interface TrixtaReactionBaseProps {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;
}

export interface TrixtaActionBaseProps {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
}

// TODO: improve types
export type TrixtaDispatch<T = never> = [T] extends [never] ? () => void : (data: T) => void;

export type TrixtaState<TRole = string> = {
  reactions: Record<string, TrixtaReaction>;
  actions: Record<string, TrixtaAction>;
  error: defaultUnknownType;
  authorizationStarted: boolean;
  authorizingStatus: Record<string, unknown>;
  schemaFormSettings: SchemaFormUISettings;
  agentDetails: TRole[];
};

export interface TrixtaActionDebugOptions {
  slowdown: number;
  debugRole?: string;
  inspect: boolean;
  debug_broadcast: {
    role?: string;
  };
  // eslint-disable-next-line camelcase
  effect_only?: boolean;
}

export interface TrixtaActionOptions {
  options?: unknown;
}

export interface TrixtaInstanceResponse<
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> {
  /**
   * If, error from Trixta, the error response for Reaction / Action
   */
  error?: TErrorType;
  /**
   * If, no error from Trixta, the response for Reaction / Action
   */
  success?: TSuccessType;
}

export interface TrixtaInstanceDetails<TInitialData = defaultUnknownType>
  extends Record<string, unknown> {
  // eslint-disable-next-line camelcase
  /**
   * Initial Data returned from Trixta for Reaction / Action
   */
  initial_data: TInitialData;
  /**
   * Type of Trixta reaction if instance of Trixta Reaction
   */
  type?: TrixtaReactionType;
  /**
   * Status from from Trixta
   */
  status: string;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref?: string;
  /**
   * Timestamp of when instance created
   */
  dateCreated: string;
}

export interface TrixtaInstance<
  /**
   * Type of data for initial data from Trixta for Reaction / Action
   */
  TInitialData = defaultUnknownType,
  /**
   * Type of data for Trixta response for Reaction / Action
   */
  TSuccessType = defaultUnknownType,
  /**
   * Type of data for Trixta error response for Reaction / Action
   */
  TErrorType = defaultUnknownType
> extends Record<string, unknown> {
  details?: TrixtaInstanceDetails<TInitialData>;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export interface TrixtaReaction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  loadingStatus: Record<string, unknown>;
  instances:
    | {
        requestForEffect?: TrixtaInstance[];
        requestForResponse?: TrixtaInstance[];
      }
    | [];
}

export interface TrixtaCommon {
  /**
   * Name of Trixta action or reaction
   */
  name: string;
  /**
   * Description of Trixta action or reaction
   */
  description: string;
  /**
   * Notes of Trixta action or reaction
   */
  notes: string;
  /**
   * Json schema for React Json Schema Form
   */
  request_schema: unknown;
  /**
   * Json schema for React Json Schema Form on response
   */
  // eslint-disable-next-line camelcase
  response_schema: unknown;
  /**
   * Ui Schema for React Json Schema Form
   */
  // eslint-disable-next-line camelcase
  request_settings: unknown;
  tags: Array<string>;
}

export interface TrixtaAction {
  common: TrixtaCommon;
  mode: TrixtaInstanceMode;
  loadingStatus: Record<string, unknown>;
  instances: TrixtaInstance[] | [];
}

export enum TrixtaInstanceModeType {
  replace = 'replace',
  accumulate = 'accumulate',
}

export interface TrixtaInstanceMode {
  type: TrixtaInstanceModeType;
  limit?: number;
}

export interface SchemaFormUISettings {
  showErrorList: false;
  noHtml5Validate: true;
  liveValidate: false;
  liveOmit: false;
  omitExtraData: false;
  safeRenderCompletion: false;
}

export interface SubmitTrixtaActionResponse<TFormData = defaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Data to submit to Trixta
   */
  formData: TFormData;
  /**
   * True, If the responses for Trixta action should be cleared before submitting
   */
  clearResponse?: boolean;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: TrixtaActionOptions;
  /**
   * Enables debugging for action in Trixta flow
   */
  debugMode?: boolean;
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Event name for data to dispatch before submitting to Trixta action
   */
  requestEvent?: string;
  /**
   * Event name for data to dispatch after Trixta action response
   */
  responseEvent?: string;
  /**
   * Event name for data to dispatch after Trixta action error response
   */
  errorEvent?: string;
}

export interface SubmitTrixtaReactionResponse<TFormData = defaultUnknownType> {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * Data to submit to Trixta
   */
  formData: TFormData;
  /**
   * Unique ref no for Trixta reaction
   */
  ref: string;
  /**
   * Event name for data to dispatch before submitting to Trixta Reaction response
   */
  requestEvent?: string;
  /**
   * Event name for data to dispatch after Trixta reaction response
   */
  responseEvent?: string;
  /**
   * Event name for data to dispatch after Trixta reaction error response
   */
  errorEvent?: string;
}

// TODO: implement this across all Trixta request responses
export type TrixtaResponse<DataT = Record<string, unknown>, OtherT = unknown> = {
  code?: number;
  success?: boolean;
  message?: string;
  data?: DataT;
} & OtherT;
