import { FormProps } from '@rjsf/core';
import * as React from 'react';
import { config } from '../../../config';
import { DefaultUnknownType } from '../../types/common';
export interface TrixtaReactJsonSchemaFormProps<TFormData>
  extends FormProps<TFormData> {
  submittable?: boolean;
}

const TrixtaForm = config.trixtaForm;

function TrixtaFormComponent<TFormData = DefaultUnknownType>({
  submittable = true,
  onSubmit,
  idPrefix,
  schema,
  formData,
  uiSchema,
}: TrixtaReactJsonSchemaFormProps<TFormData>): JSX.Element {
  if (React.isValidElement(TrixtaForm)) {
    return (
      <TrixtaForm
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formData={formData}
        {...config.props}
        uiSchema={uiSchema}
      >
        {submittable ? (
          <>
            <button type="submit" className="btn btn-info">
              Submit
            </button>
          </>
        ) : (
          <></>
        )}
      </TrixtaForm>
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
