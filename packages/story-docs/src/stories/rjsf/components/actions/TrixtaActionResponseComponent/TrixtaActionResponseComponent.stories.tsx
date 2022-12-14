import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { TrixtaActionResponseComponentArgs } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_ACTION_ARG_TYPE,
  DEFAULT_RJSF_ACTIONS_COMPONENTS_PATH,
} from '../../../../constants/storybook';
import {
  getGlobalsRoleName,
  getGlobalsActionName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';
import { TrixtaActionResponseComponent } from '@trixtateam/trixta-js-rjsf';

export default {
  title: `${DEFAULT_RJSF_ACTIONS_COMPONENTS_PATH}TrixtaActionResponseComponent`,
  argTypes: { ...DEFAULT_ACTION_ARG_TYPE },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
  component: TrixtaActionResponseComponent,
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
