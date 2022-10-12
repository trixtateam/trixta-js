import { FormProps, withTheme } from '@rjsf/core';
import * as React from 'react';
import { config } from '../../config';
import { getDefaultUISchema } from '../../utils';

const ThemedForm = withTheme(config.props);

export interface TrixtaReactJsonSchemaFormProps<TFormData>
  extends FormProps<TFormData> {
  isRequestForEffect?: boolean;
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
}: TrixtaReactJsonSchemaFormProps<TFormData>): React.ReactElement {
  const { formContext: formContextThemeProp, ...formProps } = config.props;
  return (
    <ThemedForm
      idPrefix={idPrefix}
      onSubmit={onSubmit}
      schema={schema}
      formContext={{ ...formContextThemeProp, ...formContext }}
      formData={formData}
      {...formProps}
      uiSchema={getDefaultUISchema(uiSchema, isRequestForEffect, isInProgress)}
    />
  );
}

export default TrixtaFormComponent;
