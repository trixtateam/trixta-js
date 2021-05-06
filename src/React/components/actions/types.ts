import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstanceResponse,
} from './../../types/common';
export interface TrixtaActionComponentArgs<
  TFormData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Name of Trixta role
   */
  roleName: string;
  dispatchSubmitActionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  loading: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}
