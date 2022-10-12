import { TrixtaActionBaseProps, TrixtaInstance } from '../../../types';

export interface TrixtaActionInstanceComponentProps
  extends TrixtaActionBaseProps {
  instanceIndex: number;
  /**
   * Enables Trixta console debbugging. If 'true', open the console and see verbose logging
   */
  debugMode?: boolean;
  instance: TrixtaInstance;
}
