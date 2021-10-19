import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import TrixtaAuth from '.';
import {
  DEFAULT_COMPONENTS_PATH,
  DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  DEFAULT_TRIXTA_ROLES_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { getGlobalsRoleName } from '../../../stories/utils/globalsHelper';

export default {
  title: `${DEFAULT_COMPONENTS_PATH}TrixtaAuth`,
  component: TrixtaAuth,
  parameters: {
    status: {
      type: 'released', // 'beta' | 'stable' | 'deprecated'
    },
  },
  argTypes: {
    ...DEFAULT_TRIXTA_ROLES_ARG_TYPE,
    ...DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  },
} as ComponentMeta<typeof TrixtaAuth>;

const Template: ComponentStory<typeof TrixtaAuth> = (args, globals) => (
  <TrixtaAuth {...args} roles={getGlobalsRoleName(globals)}>
    {<div>You can only see me if you have access</div>}
  </TrixtaAuth>
);

export const Default = Template.bind({});
Default.args = {};
