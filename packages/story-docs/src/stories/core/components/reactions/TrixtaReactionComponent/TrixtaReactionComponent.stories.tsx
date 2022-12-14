import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { TrixtaReactionComponent } from '@trixtateam/trixta-js-core';
import { TrixtaReactionComponentArgs } from '@trixtateam/trixta-js-core';
import {
  DEFAULT_REACTIONS_COMPONENTS_PATH,
  DEFAULT_REACTION_ARG_TYPE,
} from '../../../../constants/storybook';
import {
  getGlobalsReactionName,
  getGlobalsRoleName,
} from '../src/../../../../../utils/globalsHelper';
import { JsonViewer } from '../src/../../../../../utils/JsonViewer';
import { DemoChildReactionComponent } from '../src/../../../../../utils/DemoChildren';

export default {
  title: `${DEFAULT_REACTIONS_COMPONENTS_PATH}TrixtaReactionComponent`,
  component: TrixtaReactionComponent.WrappedComponent,
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    status: {
      type: 'beta', // 'beta' | 'stable' | 'deprecated'
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

const ChildrenAsProps: ComponentStory<typeof TrixtaReactionComponent> = (
  args,
  globals,
) => {
  return (
    <TrixtaReactionComponent
      {...args}
      roleName={getGlobalsRoleName(globals)}
      actionName={getGlobalsReactionName(globals)}
    >
      {(props: TrixtaReactionComponentArgs) => (
        <DemoChildReactionComponent {...props} />
      )}
    </TrixtaReactionComponent>
  );
};

export const CustomComponentAsChildProp = ChildrenAsProps.bind({});
CustomComponentAsChildProp.args = {};
