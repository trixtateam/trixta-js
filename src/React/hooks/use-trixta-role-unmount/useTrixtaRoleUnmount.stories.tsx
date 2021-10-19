import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaRoleUnmount } from '..';
import {
  DEFAULT_HOOKS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../stories/constants/storybook';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaRoleUnmountProps } from './types';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaRoleUnmount`,
  argTypes: { ...DEFAULT_TRIXTA_ROLE_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'stable', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaRoleUnmountProps> = (args) => (
  <HookWrapper<typeof useTrixtaRoleUnmount>
    hook={useTrixtaRoleUnmount}
    props={[args]}
  />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: 'everyone-anon',
};
