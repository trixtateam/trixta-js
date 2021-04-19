import { TrixtaCommon, TrixtaDispatch } from '../../types';
import { TrixtaInstanceResponse } from './../../types';
export interface TrixtaActionComponentArgs<TFormData = undefined, KResponse = unknown> {
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
  response?: TrixtaInstanceResponse<KResponse>;
}
