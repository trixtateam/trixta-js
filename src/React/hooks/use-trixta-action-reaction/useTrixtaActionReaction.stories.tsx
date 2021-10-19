import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaActionReaction } from '..';
import { DEFAULT_HOOKS_PATH } from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaActionReactionProps } from './types';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaActionReaction`,
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaActionReactionProps> = (args) => (
  <HookWrapper<typeof useTrixtaActionReaction>
    hook={useTrixtaActionReaction}
    props={[args]}
  />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  actionProps: { actionName: 'test', roleName: DEFAULT_TRIXTA_ROLE },
  reactionProps: { reactionName: 'test' },
};
