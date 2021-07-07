import {
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaReactionBaseProps,
} from '../../types';
import {
  DefaultUnknownType,
  TrixtaInstanceDetails,
  TrixtaInstanceResponse,
} from './../../types';
export interface TrixtaReactionComponentArgs<
  TInitialData = DefaultUnknownType,
  TFormData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaReactionBaseProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: TInitialData;
  isInProgress: boolean;
  loading?: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaInstanceDetails<TInitialData>;
}
