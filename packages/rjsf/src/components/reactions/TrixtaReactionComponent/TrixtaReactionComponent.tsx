/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  TrixtaReactionComponent as TRC,
  DefaultUnknownType,
} from '@trixtateam/trixta-js-core';
import TrixtaFormComponent from '../../TrixtaFormComponent/TrixtaFormComponent';
import { TrixtaReactionComponentProps } from './types';

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
        data,
        loading,
        details,
        loadingStatusRef,
        ...rest
      }) => {
        const hasResponse = response && (response.error || response.success);

        if (!hasResponse && instance?.details) {
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
