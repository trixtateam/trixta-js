import React from 'react';
import {
  TrixtaActionComponent,
  TrixtaActionComponentProps,
} from '../../../React/components/actions/TrixtaActionComponent';
import { TrixtaActionInstanceComponent } from '../../../React/components/actions/TrixtaActionInstanceComponent';
import { DefaultUnknownType } from '../../../React/types/common';
import TrixtaFormComponent from '../TrixtaFormComponent';

function TrixtaActionFormComponent(
  props: TrixtaActionComponentProps,
): React.ReactElement | null {
  return (
    <TrixtaActionComponent {...props}>
      {({
        isInProgress,
        submit,
        common,
        initialData,
        roleName,
        actionName,
        instances,
      }) => {
        if (common) {
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
              formContext={props}
              formData={formData}
              uiSchema={uiSchema}
              onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
                submit(formData);
              }}
            />
          );
        }
        return instances.map((_, index) => (
          <TrixtaActionInstanceComponent
            key={`${roleName}-${actionName}-${index}`}
            {...props}
            actionName={actionName}
            instance={instances[index]}
            instanceIndex={index}
            debugMode={props.debugMode}
            roleName={roleName}
          />
        ));
      }}
    </TrixtaActionComponent>
  );
}

export default TrixtaActionFormComponent;
