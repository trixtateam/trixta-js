import {
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaReactionBaseProps,
} from '../../types';
import {
  DefaultUnknownType,
  TrixtaReactionInstanceDetails,
  TrixtaInstanceResponse,
} from './../../types';
export interface TrixtaReactionComponentArgs<
  TInitialData = DefaultUnknownType,
  TFormData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaReactionBaseProps {
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: TInitialData;
  isInProgress: boolean;
  loading?: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaReactionInstanceDetails<TInitialData>;
}
