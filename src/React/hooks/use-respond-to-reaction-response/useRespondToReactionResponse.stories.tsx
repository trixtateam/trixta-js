import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useRespondToReactionResponse } from '..';
import {
  DEFAULT_REACTIONS_HOOKS_PATH,
  DEFAULT_REACTION_HOOK_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseRespondToReactionResponseProps } from './types';
export default {
  title: `${DEFAULT_REACTIONS_HOOKS_PATH}useRespondToReactionResponse`,
  argTypes: { ...DEFAULT_REACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'released', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseRespondToReactionResponseProps> = (args) => (
  <HookWrapper<typeof useRespondToReactionResponse>
    hook={useRespondToReactionResponse}
    props={[args]}
  />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  reactionName: 'test',
};
