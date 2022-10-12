import { FormProps, UiSchema, UISchemaSubmitButtonOptions } from '@rjsf/core';

/**
 * Returns a default or updated schema with submitButtonOptions
 */
export function getDefaultUISchema(
  uiSchema: FormProps<unknown>['uiSchema'],
  requestForEffect?: boolean,
  isInProgress?: boolean,
): UiSchema {
  if (!requestForEffect && !uiSchema) return {};
  const updatedSchema = uiSchema ? { ...uiSchema } : {};
  const submitButtonOptions: UISchemaSubmitButtonOptions =
    updatedSchema && updatedSchema['ui:submitButtonOptions']
      ? {
          ...updatedSchema['ui:submitButtonOptions'],
        }
      : {
          norender: !!requestForEffect,
          submitText: 'Submit',
          props: {},
        };
  if (isInProgress && submitButtonOptions['progressText']) {
    submitButtonOptions['submitText'] = submitButtonOptions['progressText'];
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (requestForEffect) submitButtonOptions['norender'] = true;
  updatedSchema['ui:submitButtonOptions'] = submitButtonOptions;
  return updatedSchema;
}
