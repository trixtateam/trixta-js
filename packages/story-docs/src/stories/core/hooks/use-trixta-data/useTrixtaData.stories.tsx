import React from 'react';
import { useTrixtaData } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_HOOKS_PATH,
  DEFAULT_TRIXTA_ROLE_ARG_TYPE,
} from '../../../constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../constants/trixta';
import { getGlobalsRoleName } from '../src/../../../../utils/globalsHelper';
import HookWrapper from '../src/../../../../utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { ComponentMeta, ComponentStory } from '@storybook/react';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaData`,
  argTypes: { ...DEFAULT_TRIXTA_ROLE_ARG_TYPE },
  component: DocsGenerator,
  parameters: {
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
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
  };
  return (
    <HookWrapper<typeof useTrixtaData> hook={useTrixtaData} props={[props]} />
  );
};
export const Default = ComponentTemplate.bind({});
Default.args = {};
