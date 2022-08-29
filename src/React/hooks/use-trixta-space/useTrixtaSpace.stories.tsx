import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { DEFAULT_HOOKS_PATH } from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import { getGlobalsRoleName } from '../../../stories/utils/globalsHelper';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaSpaceProps } from './types';
import { useTrixtaSpace } from './use-trixta-space';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaSpace`,
  argTypes: {},
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaSpaceProps> = (args, globals) => {
  const props = {
    ...args,
    roleName: getGlobalsRoleName(globals, DEFAULT_TRIXTA_ROLE),
  };
  return (
    <HookWrapper<typeof useTrixtaSpace> hook={useTrixtaSpace} props={[props]} />
  );
};
export const Default = ComponentTemplate.bind({});
