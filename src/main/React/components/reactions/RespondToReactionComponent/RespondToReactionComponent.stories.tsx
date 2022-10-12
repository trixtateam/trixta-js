import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { RespondToReactionComponent } from '.';
import {
  DEFAULT_REACTIONS_COMPONENTS_PATH,
  DEFAULT_REACTION_ARG_TYPE,
} from '../../../../../stories/constants/storybook';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../../../../../stories/utils/globalsHelper';

export default {
  title: `${DEFAULT_REACTIONS_COMPONENTS_PATH}RespondToReactionComponent`,
  component: RespondToReactionComponent,
  argTypes: { ...DEFAULT_REACTION_ARG_TYPE },
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as ComponentMeta<typeof RespondToReactionComponent>;

const Template: ComponentStory<typeof RespondToReactionComponent> = (
  args,
  globals,
) => (
  <RespondToReactionComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    reactionName={getGlobalsReactionName(globals)}
  />
);

export const Default = Template.bind({});
Default.args = {};
