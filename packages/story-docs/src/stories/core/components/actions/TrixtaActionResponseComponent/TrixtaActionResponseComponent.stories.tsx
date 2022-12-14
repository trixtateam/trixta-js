import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  TrixtaActionResponseComponentArgs,
  TrixtaActionResponseComponent,
} from '@trixtateam/trixta-js-core';
import {
  DEFAULT_ACTIONS_COMPONENTS_PATH,
  DEFAULT_ACTION_ARG_TYPE,
} from '../../../../constants/storybook';
import {
  getGlobalsRoleName,
  getGlobalsActionName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';

export default {
  title: `${DEFAULT_ACTIONS_COMPONENTS_PATH}TrixtaActionResponseComponent`,
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
  component: TrixtaActionResponseComponent.WrappedComponent,
} as ComponentMeta<typeof TrixtaActionResponseComponent>;

const Template: ComponentStory<typeof TrixtaActionResponseComponent> = (
  args,
  globals,
) => (
  <TrixtaActionResponseComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    actionName={getGlobalsActionName(globals)}
  >
    {(props: TrixtaActionResponseComponentArgs) => <JsonViewer data={props} />}
  </TrixtaActionResponseComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};
