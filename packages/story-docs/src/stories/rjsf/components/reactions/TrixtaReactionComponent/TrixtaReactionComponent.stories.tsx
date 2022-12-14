import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { TrixtaReactionComponent } from '@trixtateam/trixta-js-rjsf';
import { TrixtaReactionComponentArgs } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_REACTION_ARG_TYPE,
  DEFAULT_RJSF_REACTIONS_COMPONENTS_PATH,
} from '../../../../constants/storybook';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';

export default {
  title: `${DEFAULT_RJSF_REACTIONS_COMPONENTS_PATH}TrixtaReactionComponent`,
  component: TrixtaReactionComponent,
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
  argTypes: { ...DEFAULT_REACTION_ARG_TYPE },
} as ComponentMeta<typeof TrixtaReactionComponent>;

const Template: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => (
  <TrixtaReactionComponent
    {...args}
    roleName={getGlobalsRoleName(globals)}
    reactionName={getGlobalsReactionName(globals)}
  >
    {(props: TrixtaReactionComponentArgs) => <JsonViewer data={props} />}
  </TrixtaReactionComponent>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: { disable: true },
};

const UsingDefaultForm: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaReactionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      reactionName={getGlobalsReactionName(globals)}
    />
  );
};

export const UsingDefaultFormProp = UsingDefaultForm.bind({});
UsingDefaultForm.args = {};
