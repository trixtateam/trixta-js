import React from 'react';
import TRC from '../../../main/React/components/reactions/TrixtaReactionComponent/TrixtaReactionComponent';
import { TrixtaReactionComponentProps as TRCProps } from '../../../main/React/components/reactions/TrixtaReactionComponent/types';
import { DefaultUnknownType } from '../../../main/React/types/common';
import TrixtaFormComponent from '../TrixtaFormComponent';

export type TrixtaReactionComponentProps = TRCProps;

function TrixtaReactionComponent(
  props: TrixtaReactionComponentProps,
): React.ReactElement | null {
  return (
    <TRC {...props}>
      {({
        submit,
        response,
        isInProgress,
        common,
        roleName,
        reactionName,
        requestForEffect,
        instance,
        instanceRef,
        ...rest
      }) => {
        const hasResponse = response && (response.error || response.success);
        if (hasResponse && instance?.details) {
          const formData = instance?.details.initial_data ?? {};
          const uiSchema = common.request_settings ?? {};
          const schema = common.request_schema ?? {};
          return (
            <TrixtaFormComponent
              formData={formData}
              uiSchema={uiSchema}
              schema={schema}
              isInProgress={isInProgress}
              formContext={{ ...rest }}
              idPrefix={`${roleName}-${reactionName}-${instanceRef}`}
              isRequestForEffect={requestForEffect}
              onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
                submit(formData);
              }}
            />
          );
        }
        return null;
      }}
    </TRC>
  );
}

export default TrixtaReactionComponent;
