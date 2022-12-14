import React from 'react';
import { DEFAULT_HOOKS_PATH } from '../../../constants/storybook';
import { DEFAULT_TRIXTA_ROLE } from '../../../constants/trixta';
import { getGlobalsRoleName } from '../src/../../../../utils/globalsHelper';
import HookWrapper from '../src/../../../../utils/HookWrapper';
import DocsGenerator from './docs-generator';
import { useTrixtaRoles } from '@trixtateam/trixta-js-core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
export default {
  title: `${DEFAULT_HOOKS_PATH}useTrixtaRoles`,
  argTypes: {},
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
    <HookWrapper<typeof useTrixtaRoles> hook={useTrixtaRoles} props={[props]} />
  );
};
export const Default = ComponentTemplate.bind({});
