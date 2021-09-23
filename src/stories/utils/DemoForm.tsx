import React from "react";
import { TrixtaActionComponentArgs } from "../../React/components/actions/types";
import { TrixtaReactionComponentArgs } from "../../React/components/reactions/types";
import { DefaultUnknownType } from "../../React/types/common";
import TrixtaReactJsonSchemaForm from './FormComponent';

export const DemoChildFormComponent = (props: TrixtaActionComponentArgs|TrixtaReactionComponentArgs): React.ReactElement => {
  if(!props.common) return <></>;
  const formData = props.common.form_data ?? {};
  const schema = props.common.request_schema ?? {};
  const uiSchema = props.common.request_settings ?? {};
    return (
      <TrixtaReactJsonSchemaForm
        idPrefix={`${props.roleName}-${props.common.name}`}
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
        onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
          props.submit(formData);
        }}
      />
    );
}
