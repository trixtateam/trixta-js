import { FormProps, withTheme } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import * as React from 'react';
import { Button } from 'react-bootstrap';

const ThemedForm = withTheme({});
export interface TrixtaReactJsonSchemaFormProps<TFormData>
  extends FormProps<TFormData> {
  submittable?: boolean;
}

function TrixtaFormComponent<TFormData = never>({
  submittable = true,
  onSubmit,
  idPrefix,
  schema,
  formData,
  uiSchema,
  formContext,
}: TrixtaReactJsonSchemaFormProps<TFormData>): React.ReactElement {
  if (ThemedForm) {
    return (
      <ThemedForm
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formContext={formContext}
        formData={formData}
        uiSchema={uiSchema}
        validator={validator}
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
