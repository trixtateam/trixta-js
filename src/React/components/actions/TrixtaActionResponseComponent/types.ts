import { TrixtaActionBaseProps } from '../../../types';
import { TrixtaActionResponseComponentArgs } from '../types';

export interface TrixtaActionResponseComponentProps
  extends TrixtaActionBaseProps {
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode?: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?:
    | React.ReactNode
    | ((props: TrixtaActionResponseComponentArgs) => React.ReactNode);
}
