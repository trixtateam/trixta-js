import { DefaultUnknownType } from '../types';

export * from '../hooks/use-respond-to-reaction-effect/types';
export * from '../hooks/use-respond-to-reaction-response/types';
export * from '../hooks/use-trixta-action/types';
export * from '../hooks/use-trixta-action-reaction/types';
export * from '../hooks/use-trixta-auth/types';

export interface submitTrixtaFunctionParameters {
  /**
   * Data to submit for Trixta Reaction / Action
   */
  data: DefaultUnknownType;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref?: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction / Action response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action error response
   */
  errorEvent?: string;
}
