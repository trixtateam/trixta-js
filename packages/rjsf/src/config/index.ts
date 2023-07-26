import type { FormProps } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import { GenericObjectType } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { ComponentType } from 'react';
export type TrixtaFormProps<
  T = any,
  S extends JSONSchema7 = any,
  F extends GenericObjectType = any
> = Omit<
  FormProps<T, S, F>,
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
  form?: ComponentType<FormProps>;
} = {
  props: { validator },
  form: undefined,
};

export function setJsonSchemaFormProps<TData>(
  props: TrixtaFormProps<TData>,
): void {
  config.props = props;
}

export function setJsonSchemaForm(form: ComponentType<FormProps>): void {
  config.form = form;
}

export { config };
