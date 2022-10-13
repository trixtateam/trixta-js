/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaReactionBaseProps,
} from '../../types';
import {
  DefaultUnknownType,
  TrixtaInstanceResponse,
  TrixtaReactionInstance,
  TrixtaReactionInstanceDetails,
} from '../../types/common';

export interface TrixtaReactionComponentArgs<
  TInitialData = DefaultUnknownType,
  TFormData = any,
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
  instance?: TrixtaReactionInstance;
  instanceRef: string;
}