import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { useTrixtaRoleUnmount } from '..';
import {
  DEFAULT_HOOKS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../../stories/constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../../stories/constants/trixta';
import { getGlobalsRoleName } from '../../../../stories/utils/globalsHelper';
import HookWrapper from '../../../../stories/utils/HookWrapper';
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

const ComponentTemplate: Story<UseTrixtaRoleUnmountProps> = (args, globals) => {
  const props = {
    ...args,
    roleName: getGlobalsRoleName(globals, DEFAULT_TRIXTA_ROLE),
  };
  return (
    <HookWrapper<typeof useTrixtaRoleUnmount>
      hook={useTrixtaRoleUnmount}
      props={[props]}
    />
  );
};
export const Default = ComponentTemplate.bind({});
Default.args = {
  roleName: 'everyone-anon',
};
