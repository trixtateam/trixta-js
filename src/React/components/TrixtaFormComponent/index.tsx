import type { FormProps } from '@rjsf/core';
import * as React from 'react';
import { config, TrixtaFormProps } from '../../../config';
import { getDefaultUISchema } from '../../../utils/trixta';

const withTheme = (props: TrixtaFormProps) => {
  let rjsf = undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-var-requires
    rjsf = require('@rjsf/core');
  } catch (er) {
    rjsf = null;
  }

  if (rjsf) {
    return rjsf.withTheme(props);
  }

  return undefined;
};

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
}: TrixtaReactJsonSchemaFormProps<TFormData>): JSX.Element {
  if (ThemedForm) {
    const { formContext: formContextThemeProp, ...formProps } = config.props;
    return (
      <ThemedForm
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formContext={{ ...formContextThemeProp, ...formContext }}
        formData={formData}
        {...formProps}
        uiSchema={getDefaultUISchema(
          uiSchema,
          isRequestForEffect,
          isInProgress,
        )}
      />
    );
  }
  return <>To make use of rsjf, npm install @rsjf/core dependency</>;
}

export default TrixtaFormComponent;
