import React from 'react';
import { useRespondToReactionResponse } from '@trixtateam/trixta-js-core';
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
  title: `${DEFAULT_REACTIONS_HOOKS_PATH}useRespondToReactionResponse`,
  argTypes: { ...DEFAULT_REACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'released', // 'beta' | 'stable' | 'deprecated'
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
    <HookWrapper<typeof useRespondToReactionResponse>
      hook={useRespondToReactionResponse}
      props={[props]}
    />
  );
};
export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  reactionName: 'test',
};
