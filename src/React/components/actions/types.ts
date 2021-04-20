import { defaultUnknownType, TrixtaCommon, TrixtaDispatch } from '../../types';
import { TrixtaInstanceResponse } from './../../types';
export interface TrixtaActionComponentArgs<
  TFormData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
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
