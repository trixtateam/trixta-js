import { UiSchema, UISchemaSubmitButtonOptions } from '@rjsf/utils';
/**
 * Returns a default or updated schema with submitButtonOptions
 */
export function getDefaultUISchema(
  uiSchema?: UiSchema,
  requestForEffect?: boolean,
  isInProgress?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!requestForEffect && !uiSchema) return undefined;
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
