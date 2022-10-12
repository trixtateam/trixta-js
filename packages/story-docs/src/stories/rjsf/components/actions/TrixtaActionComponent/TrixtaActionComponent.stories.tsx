import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { TrixtaActionComponent } from '@trixtateam/trixta-js-rjsf';
import {
  DEFAULT_ACTION_ARG_TYPE,
  DEFAULT_RJSF_ACTIONS_COMPONENTS_PATH,
} from '../../../../constants/storybook';
import {
  getGlobalsRoleName,
  getGlobalsActionName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';
import { TrixtaActionComponentArgs } from '@trixtateam/trixta-js-core';

export default {
  title: `${DEFAULT_RJSF_ACTIONS_COMPONENTS_PATH}TrixtaActionComponent`,
  argTypes: { ...DEFAULT_ACTION_ARG_TYPE },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
    status: {
      type: 'new', // 'beta' | 'stable' | 'deprecated'
    },
  },
  component: TrixtaActionComponent,
} as ComponentMeta<typeof TrixtaActionComponent>;

const Template: ComponentStory<typeof TrixtaActionComponent> = (
  args,
  globals,
) => (
  <TrixtaActionComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    actionName={getGlobalsActionName(globals)}
  >
    {(props: TrixtaActionComponentArgs) => <JsonViewer data={props} />}
  </TrixtaActionComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};
const UsingDefaultForm: ComponentStory<typeof TrixtaActionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaActionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      actionName={getGlobalsActionName(globals)}
    />
  );
};
export const UsingDefaultFormProp = UsingDefaultForm.bind({});
UsingDefaultForm.args = {};
