import React from 'react';
import { TrixtaActionComponentArgs } from '@trixtateam/trixta-js-core';
import { TrixtaReactionComponentArgs } from '@trixtateam/trixta-js-core';
import { DefaultUnknownType } from '@trixtateam/trixta-js-core';
import validator from '@rjsf/validator-ajv6';
import TrixtaReactJsonSchemaForm from './FormComponent';

export const DemoChildFormComponent = (
  props: TrixtaActionComponentArgs | TrixtaReactionComponentArgs,
): React.ReactElement => {
  if (!props.common) return <></>;
  const formData = props.common.form_data ?? {};
  const schema = props.common.request_schema ?? {};
  const uiSchema = props.common.request_settings ?? {};
  return (
    <TrixtaReactJsonSchemaForm
      idPrefix={`${props.roleName}-${props.common.name}`}
      schema={schema}
      formData={formData}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
        props.submit(formData);
      }}
    />
  );
};
