import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useRespondToReactionEffect } from '..';
import {
  DEFAULT_REACTIONS_HOOKS_PATH,
  DEFAULT_REACTION_HOOK_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../../../stories/utils/globalsHelper';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseRespondToReactionEffectProps } from './types';
export default {
  title: `${DEFAULT_REACTIONS_HOOKS_PATH}useRespondToReactionEffect`,
  argTypes: { ...DEFAULT_REACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'released', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseRespondToReactionEffectProps> = (
  args,
  globals,
) => {
  const props = {
    ...args,
    roleName: getGlobalsRoleName(globals, DEFAULT_TRIXTA_ROLE),
    reactionName: getGlobalsReactionName(globals, 'login'),
  };
  return (
    <HookWrapper<typeof useRespondToReactionEffect>
      hook={useRespondToReactionEffect}
      props={[props]}
    />
  );
};

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  reactionName: 'test',
};
