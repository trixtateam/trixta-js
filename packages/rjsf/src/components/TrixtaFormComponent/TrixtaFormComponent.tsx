import { FormProps, withTheme } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import React from 'react';
import { config } from '../../config';
import { getDefaultUISchema } from '../../utils';

const DefaultForm = withTheme({ ...config.props });
const _Form = config.form;
export interface TrixtaReactJsonSchemaFormProps<TFormData>
  extends Omit<FormProps<TFormData>, 'validator'> {
  isRequestForEffect?: boolean;
  onSubmit?: FormProps<TFormData>['onSubmit'];
  isInProgress: boolean;
}

function TrixtaFormComponent<TFormData = never>({
  isRequestForEffect,
  onSubmit,
  idPrefix,
  isInProgress,
  schema,
  formData,
  uiSchema,
  formContext,
}: TrixtaReactJsonSchemaFormProps<TFormData>): JSX.Element {
  const { formContext: formContextThemeProp, ...formProps } = config.props;
  const Form = _Form || DefaultForm;
  if (Form) {
    return (
      <Form
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formContext={{ ...formContextThemeProp, ...formContext }}
        formData={formData}
        {...formProps}
        uiSchema={getDefaultUISchema(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          uiSchema as any,
          isRequestForEffect,
          isInProgress,
        )}
        validator={validator}
      />
    );
  }

  return (
    <>Please read the README.md and install the required rjsf dependencies.</>
  );
}

export default TrixtaFormComponent;
