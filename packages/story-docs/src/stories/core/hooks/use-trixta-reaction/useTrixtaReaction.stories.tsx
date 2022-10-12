import React from 'react';
import { useTrixtaReaction } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_REACTIONS_HOOKS_PATH,
  DEFAULT_REACTION_HOOK_ARG_TYPE,
} from '../../../constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../constants/trixta';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../src/../../../../utils/globalsHelper';
import HookWrapper from '../src/../../../../utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { ComponentMeta, ComponentStory } from '@storybook/react';
export default {
  title: `${DEFAULT_REACTIONS_HOOKS_PATH}useTrixtaReaction`,
  argTypes: { ...DEFAULT_REACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as ComponentMeta<typeof DocsGenerator>;

const ComponentTemplate: ComponentStory<typeof DocsGenerator> = (
  args,
  globals,
) => {
  const props = {
    ...args,
    roleName: getGlobalsRoleName(globals, DEFAULT_TRIXTA_ROLE),
    reactionName: getGlobalsReactionName(globals, 'login'),
  };
  return (
    <HookWrapper<typeof useTrixtaReaction>
      hook={useTrixtaReaction}
      props={[props]}
    />
  );
};

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  reactionName: 'login',
};
