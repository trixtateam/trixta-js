import type { FormProps } from '@rjsf/core';
import * as React from 'react';
import { config, TrixtaFormProps } from '../../../config';
import { getDefaultUISchema } from '../../../utils/trixta';
import { DefaultUnknownType } from '../../types/common';

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
  submittable?: boolean;
}

function TrixtaFormComponent<TFormData = DefaultUnknownType>({
  submittable = true,
  onSubmit,
  idPrefix,
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
        uiSchema={getDefaultUISchema(uiSchema, !submittable)}
      />
    );
  }
  return <>To make use of rsjf, npm install @rsjf/core dependency</>;
}

export default TrixtaFormComponent;
