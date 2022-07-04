import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  DEFAULT_COMPONENTS_PATH,
  DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  DEFAULT_TRIXTA_ROLES_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { getGlobalsRoleName } from '../../../stories/utils/globalsHelper';
import TrixtaAuthComponent from './TrixtaAuthComponent';

export default {
  title: `${DEFAULT_COMPONENTS_PATH}TrixtaAuth`,
  component: TrixtaAuthComponent,
  parameters: {
    status: {
      type: 'released', // 'beta' | 'stable' | 'deprecated'
    },
  },
  argTypes: {
    ...DEFAULT_TRIXTA_ROLES_ARG_TYPE,
    ...DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  },
} as ComponentMeta<typeof TrixtaAuthComponent>;

const Template: ComponentStory<typeof TrixtaAuthComponent> = (
  args,
  globals,
) => (
  <TrixtaAuthComponent {...args} roleName={getGlobalsRoleName(globals)}>
    {<div>You can only see me if you have access</div>}
  </TrixtaAuthComponent>
);

export const Default = Template.bind({});
Default.args = {};
