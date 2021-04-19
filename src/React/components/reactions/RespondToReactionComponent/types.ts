import { TrixtaReactionInstance, TrixtaReactionDispatch } from '../../../types';
import { defaultUnknownType } from './../../../types';

export interface RespondToReactionComponentStateProps {
  instances: TrixtaReactionInstance[];
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess: boolean;
}

export interface RespondToReactionComponentProps extends TrixtaReactionDispatch {
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user
   */
  hasRoleAccess?: boolean;
  /**
   * Data to submit to Trixta
   */
  formData?: defaultUnknownType;
  /**
   * If 'true', Trixta reaction will be responded when a reaction response instance is present
   */
  shouldRespond?: boolean;
  /**
   * Trixta reaction response instances
   */
  instances?: TrixtaReactionInstance[];
}
