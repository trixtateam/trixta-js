import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { TrixtaReactionComponent } from '.';
import {
  DEFAULT_REACTIONS_COMPONENTS_PATH,
  DEFAULT_REACTION_ARG_TYPE,
} from '../../../../stories/constants/storybook';
import { DemoChildReactionComponent } from '../../../../stories/utils/DemoChildren';
import TrixtaReactJsonSchemaForm from '../../../../stories/utils/FormComponent';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../../../../stories/utils/globalsHelper';
import { JsonViewer } from '../../../../stories/utils/JsonViewer';
import { TrixtaReactionComponentArgs } from '../types';

export default {
  title: `${DEFAULT_REACTIONS_COMPONENTS_PATH}TrixtaReactionComponent`,
  component: TrixtaReactionComponent.WrappedComponent,
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
  argTypes: { ...DEFAULT_REACTION_ARG_TYPE },
} as ComponentMeta<typeof TrixtaReactionComponent>;

const Template: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => (
  <TrixtaReactionComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    reactionName={getGlobalsReactionName(globals)}
  >
    {(props: TrixtaReactionComponentArgs) => <JsonViewer data={props} />}
  </TrixtaReactionComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};

const FormAsProps: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaReactionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      reactionName={getGlobalsReactionName(globals)}
    >
      {(props: TrixtaReactionComponentArgs) => {
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
    </TrixtaReactionComponent>
  );
};

export const FormAsChildProp = FormAsProps.bind({});
FormAsChildProp.args = {};

const ChildrenAsProps: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaReactionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      actionName={getGlobalsReactionName(globals)}
    >
      {(props: TrixtaReactionComponentArgs) => (
        <DemoChildReactionComponent {...props} />
      )}
    </TrixtaReactionComponent>
  );
};

export const CustomComponentAsChildProp = ChildrenAsProps.bind({});
CustomComponentAsChildProp.args = {};
