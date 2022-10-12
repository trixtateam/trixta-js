import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  TrixtaActionComponentArgs,
  TrixtaActionComponent,
} from '@trixtateam/trixta-js-core';
import {
  DEFAULT_ACTIONS_COMPONENTS_PATH,
  DEFAULT_ACTION_ARG_TYPE,
} from '../../../../constants/storybook';
import { DemoChildActionComponent } from '../src/../../../../../utils/DemoChildren';
import {
  getGlobalsRoleName,
  getGlobalsActionName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';

export default {
  title: `${DEFAULT_ACTIONS_COMPONENTS_PATH}TrixtaActionComponent`,
  argTypes: { ...DEFAULT_ACTION_ARG_TYPE },
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
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
