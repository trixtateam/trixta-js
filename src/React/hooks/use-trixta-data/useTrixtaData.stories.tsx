import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaData } from '..';
import {
  DEFAULT_HOOKS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../stories/constants/storybook';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaData`,
  argTypes: { ...DEFAULT_TRIXTA_ROLE_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<Record<string, never>> = (args) => (
  <HookWrapper<typeof useTrixtaData> hook={useTrixtaData} props={[args]} />
);

export const Default = ComponentTemplate.bind({});
Default.args = {};
