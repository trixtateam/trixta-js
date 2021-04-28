import { TrixtaActionBaseProps, TrixtaInstance, TrixtaInstanceResponse } from '../../../types';

export interface TrixtaActionInstanceComponentStateProps extends TrixtaActionBaseProps {
  /**
   * Response for Trixta action instance
   */
  response?: false | Record<string, TrixtaInstanceResponse>;
}
export interface TrixtaActionInstanceComponentProps extends TrixtaActionBaseProps {
  instanceIndex: number;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instance: TrixtaInstance;
}
