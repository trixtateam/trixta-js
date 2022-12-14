import React from 'react';
import { TrixtaActionResponseComponent as TAR } from '@trixtateam/trixta-js-core';
import TrixtaFormComponent from '../../TrixtaFormComponent/TrixtaFormComponent';
import { TrixtaActionResponseComponentProps } from './types';

function TrixtaActionResponseComponent(
  props: TrixtaActionResponseComponentProps,
): React.ReactElement | null {
  return (
    <TAR {...props}>
      {({ common, roleName, actionName, instance, ...rest }) => {
        if (!common) return null;

        const formData = instance?.response.error || instance?.response.success;
        const schema = common.response_schema ?? {};
        const uiSchema = common.request_settings ?? {};
        return (
          <TrixtaFormComponent
            idPrefix={`${roleName}-${actionName}`}
            schema={schema}
            isInProgress={false}
            isRequestForEffect
            formContext={{ ...rest }}
            formData={formData}
            uiSchema={uiSchema}
            {...rest}
          />
        );
      }}
    </TAR>
  );
}

export default TrixtaActionResponseComponent;
