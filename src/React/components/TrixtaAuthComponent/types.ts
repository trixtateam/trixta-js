export interface TrixtaAuthProps {
  /**
   * Trixta roles or role name
   */
  roles?: string | string[];
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
}
