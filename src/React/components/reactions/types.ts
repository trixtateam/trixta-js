import { TrixtaCommon, TrixtaDispatch } from '../../types';
import { defaultUnknownType, TrixtaInstanceDetails, TrixtaInstanceResponse } from './../../types';
export interface TrixtaReactionComponentArgs<
  TFormData = defaultUnknownType,
  KResponse = defaultUnknownType
> {
  /**
   * Name of Trixta reaction
   */
  reactionName: string;
  /**
   * If 'true', Trixta reaction is not waiting for response
   */
  requestForEffect?: boolean;
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  data: defaultUnknownType;
  response?: TrixtaInstanceResponse<KResponse>;
  details?: TrixtaInstanceDetails;
}
