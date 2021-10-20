import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaAction } from '..';
import {
  DEFAULT_ACTIONS_HOOKS_PATH,
  DEFAULT_ACTION_HOOK_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import {
  getGlobalsActionName,
  getGlobalsRoleName,
} from '../../../stories/utils/globalsHelper';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaActionProps } from './types';
export default {
  title: `${DEFAULT_ACTIONS_HOOKS_PATH}useTrixtaAction`,
  argTypes: { ...DEFAULT_ACTION_HOOK_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaActionProps> = (args, globals) => {
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
