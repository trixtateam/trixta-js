import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaReaction } from '..';
import {
  DEFAULT_REACTIONS_HOOKS_PATH,
  DEFAULT_REACTION_HOOK_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaReactionProps } from './types';
export default {
  title: `${DEFAULT_REACTIONS_HOOKS_PATH}useTrixtaReaction`,
  argTypes: { ...DEFAULT_REACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaReactionProps> = (args) => (
  <HookWrapper<typeof useTrixtaReaction>
    hook={useTrixtaReaction}
    props={[args]}
  />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  reactionName: 'login',
};
