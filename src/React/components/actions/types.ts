import { DefaultUnknownType, TrixtaCommon, TrixtaDispatch } from '../../types';
import { TrixtaInstanceResponse } from './../../types';
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
  isInProgress: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export interface TrixtaActionResponseComponentArgs<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}
