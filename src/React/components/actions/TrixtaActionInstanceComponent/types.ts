import { TrixtaActionBaseProps, TrixtaInstance } from '../../../types';

export interface TrixtaActionInstanceComponentProps
  extends TrixtaActionBaseProps {
  instanceIndex: number;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  instance: TrixtaInstance;
}
