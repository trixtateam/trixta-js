import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaAction } from '..';
import {
  DEFAULT_ACTIONS_HOOKS_PATH,
  DEFAULT_ACTION_HOOK_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
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

const ComponentTemplate: Story<UseTrixtaActionProps> = (args) => (
  <HookWrapper<typeof useTrixtaAction> hook={useTrixtaAction} props={[args]} />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: DEFAULT_TRIXTA_ROLE,
  actionName: 'login',
};
