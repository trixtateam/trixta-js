import { TrixtaActionBaseProps, TrixtaInstance, TrixtaInstanceResponse } from '../../../types';

export interface TrixtaActionInstanceComponentStateProps {
  /**
   * Response for Trixta action instance
   */
  response?: false | Record<string, TrixtaInstanceResponse>;
}
export interface TrixtaActionInstanceComponentProps extends TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instance: TrixtaInstance;
  instanceIndex?: number;
}
