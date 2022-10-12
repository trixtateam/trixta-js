import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TrixtaLoginWidget } from '@trixtateam/trixta-js-rjsf';
import React from 'react';
import {
  DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  DEFAULT_TRIXTA_ROLES_ARG_TYPE,
  DEFAULT_WIDGETS_PATH,
} from '../../../constants/storybook';

export default {
  title: `${DEFAULT_WIDGETS_PATH}TrixtaLogin`,
  component: TrixtaLoginWidget,
  parameters: {
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
  argTypes: {
    ...DEFAULT_TRIXTA_ROLES_ARG_TYPE,
    ...DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
  },
} as ComponentMeta<typeof TrixtaLoginWidget>;

const Template: ComponentStory<typeof TrixtaLoginWidget> = (args) => (
  <TrixtaLoginWidget {...args} />
);

export const Default = Template.bind({});
Default.args = {};
