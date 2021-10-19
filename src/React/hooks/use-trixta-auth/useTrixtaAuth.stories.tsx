import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaAuth } from '..';
import {
  DEFAULT_HOOKS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaAuthProps } from './types';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaAuth`,
  argTypes: { ...DEFAULT_TRIXTA_ROLE_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'stable', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaAuthProps> = (args) => (
  <HookWrapper<typeof useTrixtaAuth> hook={useTrixtaAuth} props={[args]} />
);

export const Default = ComponentTemplate.bind({});
Default.args = {
  roles: DEFAULT_TRIXTA_ROLE,
};
