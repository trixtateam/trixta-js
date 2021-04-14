import {
  SchemaFormUISettings,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstance,
  TrixtaReactionBaseProps,
} from '../../../types';

export interface TrixtaReactionInstanceComponentStateProps {
  instance: TrixtaInstance;
  schemaFormUISettings: SchemaFormUISettings;
}
export interface TrixtaReactionInstanceComponentDispatchProps {
  dispatchSubmitReactionResponse: TrixtaDispatch<unknown>;
}
export interface TrixtaReactionInstanceComponentProps extends TrixtaReactionBaseProps {
  /**
   * Event name for data to dispatch before submitting to Trixta Reaction response
   */
  requestEvent?: string | null;
  /**
   * Event name for data to dispatch after Trixta reaction response
   */
  responseEvent?: string | null;
  /**
   * Event name for data to dispatch after Trixta reaction error response
   */
  errorEvent?: string | null;
  common: TrixtaCommon;
  /**
   * Enables Trixta console debbugging
   */
  debugMode: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instanceIndex?: number;
  instanceRef?: unknown;
}
