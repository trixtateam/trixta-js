import { DefaultUnknownType, TrixtaReactionDispatch } from '../../../types';

export interface RespondToReactionComponentProps<
  TInitialData = DefaultUnknownType
> extends TrixtaReactionDispatch<TInitialData> {
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
  formData?: DefaultUnknownType;
  /**
   * If 'true', Trixta reaction will be responded when a reaction response instance is present
   */
  shouldRespond?: boolean;
}
