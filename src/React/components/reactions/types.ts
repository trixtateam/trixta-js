/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaReactionBaseProps,
} from '../../types';
import {
  DefaultUnknownType,
  TrixtaInstanceResponse,
  TrixtaReactionInstanceDetails,
} from './../../types/common';

export interface TrixtaReactionComponentArgs<
  TInitialData = DefaultUnknownType,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> extends TrixtaReactionBaseProps {
  submit: TrixtaDispatch<any>;
  common: TrixtaCommon;
  data: TInitialData;
  isInProgress: boolean;
  loading?: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
  details?: TrixtaReactionInstanceDetails<TInitialData>;
}
