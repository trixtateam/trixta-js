import { TrixtaCommon, TrixtaDispatch, TrixtaReactionBaseProps } from '../../types';
import { defaultUnknownType, TrixtaInstanceDetails, TrixtaInstanceResponse } from './../../types';
export interface TrixtaReactionComponentArgs<
  TFormData = defaultUnknownType,
  TSuccessType = defaultUnknownType,
  TErrorType = defaultUnknownType
> extends TrixtaReactionBaseProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: defaultUnknownType;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaInstanceDetails;
}
