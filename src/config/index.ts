import type { ThemeProps } from '@rjsf/core';
export type TrixtaFormProps<T = any> = Omit<
  ThemeProps<T>,
  | 'schema'
  | 'formData'
  | 'onBlur'
  | 'onChange'
  | 'onError'
  | 'onFocus'
  | 'schema'
  | 'idPrefix'
  | 'onSubmit'
  | 'uiSchema'
>;

const config: {
  props: TrixtaFormProps;
} = {
  props: {},
};

export function setJsonSchemaFormProps(props: TrixtaFormProps): void {
  config.props = props;
}

export { config };
