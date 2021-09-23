import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { RespondToReactionsComponent } from '.';
import {
  DEFAULT_REACTIONS_COMPONENTS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../../stories/constants/storybook';
import { getGlobalsRoleName } from '../../../../stories/utils/globalsHelper';

export default {
  title: `${DEFAULT_REACTIONS_COMPONENTS_PATH}RespondToReactionsComponent`,
  component: RespondToReactionsComponent,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
  argTypes: { ...DEFAULT_TRIXTA_ROLE_ARG_TYPE },
} as ComponentMeta<typeof RespondToReactionsComponent>;

const Template: ComponentStory<typeof RespondToReactionsComponent> = (
  args,
  globals,
) => (
  <RespondToReactionsComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
  />
);

export const Default = Template.bind({});
Default.args = {
  reactions: [],
};
