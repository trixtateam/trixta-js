import { TrixtaCommon, TrixtaDispatch, TrixtaReactionBaseProps } from '../../types';
import { defaultUnknownType, TrixtaInstanceDetails, TrixtaInstanceResponse } from './../../types';
export interface TrixtaReactionComponentArgs<
  TFormData = defaultUnknownType,
  KResponse = defaultUnknownType
> extends TrixtaReactionBaseProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: defaultUnknownType;
  response?: TrixtaInstanceResponse<KResponse>;
  details?: TrixtaInstanceDetails;
}
