import React from 'react';
import {
  TrixtaActionComponent as TAC,
  DefaultUnknownType,
} from '@trixtateam/trixta-js-core';
import TrixtaFormComponent from '../../TrixtaFormComponent/TrixtaFormComponent';
import { TrixtaActionComponentProps } from './types';

function TrixtaActionComponent(
  props: TrixtaActionComponentProps,
): React.ReactElement | null {
  return (
    <TAC {...props}>
      {({
        isInProgress,
        submit,
        common,
        initialData,
        roleName,
        actionName,
        ...rest
      }) => {
        if (!common) return null;
        const formData =
          initialData !== undefined
            ? initialData
            : common.form_data
            ? common.form_data
            : {};
        const schema = common.request_schema ?? {};
        const uiSchema = common.request_settings ?? {};
        return (
          <TrixtaFormComponent
            idPrefix={`${roleName}-${actionName}`}
            schema={schema}
            isInProgress={isInProgress}
            formContext={{ ...rest }}
            formData={formData}
            uiSchema={uiSchema}
            onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
              submit(formData);
            }}
          />
        );
      }}
    </TAC>
  );
}

export default TrixtaActionComponent;
