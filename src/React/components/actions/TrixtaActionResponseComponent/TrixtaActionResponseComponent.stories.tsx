import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  DEFAULT_ACTIONS_COMPONENTS_PATH,
  DEFAULT_ACTION_ARG_TYPE,
} from '../../../../stories/constants/storybook';
import {
  getGlobalsActionName,
  getGlobalsRoleName,
} from '../../../../stories/utils/globalsHelper';
import { JsonViewer } from '../../../../stories/utils/JsonViewer';
import { TrixtaActionResponseComponentArgs } from '../types';
import TrixtaActionResponseComponent from './TrixtaActionResponseComponent';

export default {
  title: `${DEFAULT_ACTIONS_COMPONENTS_PATH}TrixtaActionResponseComponent`,
  component: TrixtaActionResponseComponent.WrappedComponent,
  parameters: {
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
    },
  },
  argTypes: { ...DEFAULT_ACTION_ARG_TYPE },
} as ComponentMeta<typeof TrixtaActionResponseComponent>;

const Template: ComponentStory<typeof TrixtaActionResponseComponent> = (
  args,
  globals,
) => (
  <TrixtaActionResponseComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    actionName={getGlobalsActionName(globals)}
  >
    {(props: TrixtaActionResponseComponentArgs) => <JsonViewer data={props} />}
  </TrixtaActionResponseComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};
