import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { DEFAULT_HOOKS_PATH } from '../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../stories/constants/trixta';
import { getGlobalsRoleName } from '../../../stories/utils/globalsHelper';
import HookWrapper from '../../../stories/utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { UseTrixtaRolesProps } from './types';
import { useTrixtaRoles } from './use-trixta-roles';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaRoles`,
  argTypes: {},
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
} as Meta;

const ComponentTemplate: Story<UseTrixtaRolesProps> = (args, globals) => {
  const props = {
    ...args,
    roleName: getGlobalsRoleName(globals, DEFAULT_TRIXTA_ROLE),
  };
  return (
    <HookWrapper<typeof useTrixtaRoles> hook={useTrixtaRoles} props={[props]} />
  );
};
export const Default = ComponentTemplate.bind({});
