import React from 'react';
import { useTrixtaActionReaction } from '@trixtateam/trixta-js-core';
import { DEFAULT_HOOKS_PATH } from '../../../constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../constants/trixta';
import {
  getGlobalsActionName,
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../src/../../../../utils/globalsHelper';
import HookWrapper from '../src/../../../../utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { ComponentMeta, ComponentStory } from '@storybook/react';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaActionReaction`,
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
    actionProps: {
      actionName: getGlobalsActionName(globals, 'test'),
      roleName: DEFAULT_TRIXTA_ROLE,
    },
    reactionProps: { reactionName: getGlobalsReactionName(globals, 'test') },
  };
  return (
    <HookWrapper<typeof useTrixtaActionReaction>
      hook={useTrixtaActionReaction}
      props={[props]}
    />
  );
};
export const Default = ComponentTemplate.bind({});
Default.args = {
  actionProps: { actionName: 'test', roleName: DEFAULT_TRIXTA_ROLE },
  reactionProps: { reactionName: 'test' },
};
