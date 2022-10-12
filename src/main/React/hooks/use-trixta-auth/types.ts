export interface UseTrixtaAuthProps {
  /**
   * Trixta role name
   */
  roleName?: string;
}

export interface UseTrixtaAuthHookReturn {
  /**
   * If 'true' , Trixta socket  is connected with token parameter
   */
  isAuthenticated?: boolean;
  /**
   * If 'true', Trixta role name passed does have acccess for this user
   */
  hasRole: boolean;
  /**
   * If 'true', Trixta roles or role name passed does have acccess for this user and isAuthenticated
   */
  hasAccess: boolean;
  /**
   * If 'true', Trixta is still authorizing roles and waiting for the Trixta role channels to be joined
   */
  isAuthorizing: boolean;
}
