import { TrixtaActionBaseProps, TrixtaCommon, TrixtaDispatch } from '../../types';
import { TrixtaInstanceResponse } from './../../types';
export interface TrixtaActionComponentArgs<TFormData = undefined, KResponse = unknown>
  extends TrixtaActionBaseProps {
  dispatchSubmitActionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  loading: boolean;
  response?: TrixtaInstanceResponse<KResponse>;
}
