import { TrixtaActionBaseProps } from '../../../types';

export interface TrixtaActionResponseComponentProps
  extends TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
}
