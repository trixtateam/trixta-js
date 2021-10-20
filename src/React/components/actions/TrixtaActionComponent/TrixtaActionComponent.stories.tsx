import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  DEFAULT_ACTIONS_COMPONENTS_PATH,
  DEFAULT_ACTION_ARG_TYPE,
} from '../../../../stories/constants/storybook';
import { DemoChildActionComponent } from '../../../../stories/utils/DemoChildren';
import TrixtaReactJsonSchemaForm from '../../../../stories/utils/FormComponent';
import {
  getGlobalsActionName,
  getGlobalsRoleName,
} from '../../../../stories/utils/globalsHelper';
import { JsonViewer } from '../../../../stories/utils/JsonViewer';
import { TrixtaActionComponentArgs } from '../types';
import TrixtaActionComponent from './TrixtaActionComponent';

export default {
  title: `${DEFAULT_ACTIONS_COMPONENTS_PATH}TrixtaActionComponent`,
  argTypes: { ...DEFAULT_ACTION_ARG_TYPE },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
  component: TrixtaActionComponent.WrappedComponent,
} as ComponentMeta<typeof TrixtaActionComponent>;

const Template: ComponentStory<typeof TrixtaActionComponent> = (
  args,
  globals,
) => (
  <TrixtaActionComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    actionName={getGlobalsActionName(globals)}
  >
    {(props: TrixtaActionComponentArgs) => <JsonViewer data={props} />}
  </TrixtaActionComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};
const FormAsProps: ComponentStory<typeof TrixtaActionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaActionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      actionName={getGlobalsActionName(globals)}
    >
      {(props: TrixtaActionComponentArgs) => {
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
            onSubmit={({ formData }: { formData: unknown }) => {
              props.submit(formData);
            }}
          />
        );
      }}
    </TrixtaActionComponent>
  );
};
export const FormAsChildProp = FormAsProps.bind({});
FormAsChildProp.args = {};

const ChildrenAsProps: ComponentStory<typeof TrixtaActionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaActionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      actionName={getGlobalsActionName(globals)}
    >
      {(props: TrixtaActionComponentArgs) => (
        <DemoChildActionComponent {...props} />
      )}
    </TrixtaActionComponent>
  );
};

export const CustomComponentAsChildProp = ChildrenAsProps.bind({});
CustomComponentAsChildProp.args = {};
