import React from 'react';
import {
  TrixtaActionComponent as TAC,
  TrixtaActionComponentProps as TACProps,
} from '../../../main/React/components/actions/TrixtaActionComponent';
import { TrixtaActionInstanceComponent } from '../../../main/React/components/actions/TrixtaActionInstanceComponent';
import { DefaultUnknownType } from '../../../main/React/types/common';
import TrixtaFormComponent from '../TrixtaFormComponent';

export type TrixtaActionComponentProps = TACProps;

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
        instances,
      }) => {
        if (props.renderResponse && common) {
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
    </TAC>
  );
}

export default TrixtaActionComponent;
