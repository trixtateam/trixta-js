import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useTrixtaAction } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_ACTIONS_HOOKS_PATH,
  DEFAULT_ACTION_HOOK_ARG_TYPE,
} from '../../../constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../constants/trixta';
import {
  getGlobalsActionName,
  getGlobalsRoleName,
} from '../src/../../../../utils/globalsHelper';
import HookWrapper from '../src/../../../../utils/HookWrapper';
import DocsGenerator from './docs-generator';

export default {
  title: `${DEFAULT_ACTIONS_HOOKS_PATH}useTrixtaAction`,
  argTypes: { ...DEFAULT_ACTION_HOOK_ARG_TYPE },
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
    actionName: getGlobalsActionName(globals, 'login'),
  };
  return (
    <HookWrapper<typeof useTrixtaAction>
      hook={useTrixtaAction}
      props={[props]}
    />
  );
};

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  actionName: 'login',
};
