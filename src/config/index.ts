import type { FormProps } from '@rjsf/core';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
export type TrixtaFormProps<T = any> = Omit<
  FormProps<T>,
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
  props:
    | TrixtaFormProps
    | { validator: FormProps['validator']; formContext: TrixtaFormProps['formContext'] };
  form: Form | undefined;
} = {
  props: { validator },
  form: undefined,
};

export function setJsonSchemaFormProps(props: TrixtaFormProps): void {
  config.props = props;
}

export function setJsonSchemaForm(form: any): void {
  config.form = form;
}

export { config };
