export interface TrixtaLoginWidgetProps {
  /**
   * Override the initial data for Login
   */
  initialData?: unknown;
  /**
   * If 'true', will render the login response
   */
  renderResponse?: boolean;
  /**
   * Text for button while loggging in
   */
  loadingText?: string;
}
