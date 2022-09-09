

import { FormProps, withTheme } from '@rjsf/core';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { DefaultUnknownType } from '../../React/types/common';


const ThemedForm = withTheme({});
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
    return (
      <ThemedForm
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formContext={formContext}
        formData={formData}
        uiSchema={uiSchema}
      >
        {submittable ? (
          <>
            <Button as="input" type="submit" value="Submit" />
          </>
        ) : (
          <></>
        )}
      </ThemedForm>
    );
  }
  return (
    <>
      Invalid Trixta Form Provided. Please set a valid JsonSchemaForm with
      setJsonSchemaForm function
    </>
  );
}

export default TrixtaFormComponent;
