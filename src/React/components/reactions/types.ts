import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstanceDetails,
  TrixtaInstanceResponse,
} from './../../types/common';
import { TrixtaReactionBaseProps } from './../../types/reactions';
export interface TrixtaReactionComponentArgs<
  TFormData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaReactionBaseProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: DefaultUnknownType;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaInstanceDetails;
}
