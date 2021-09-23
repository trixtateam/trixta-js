
import { addons, types } from '@storybook/addons';
import store from '../src/stories/store/index';
import {
  ADDON_ID,
  TOOL_ID
} from '../src/stories/toolbars/trixta-role/constants';
import  TrixtaRoleToolbar  from '../src/stories/toolbars/trixta-role/trixta-toolbar';
import theme from './theme';
// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Trixta Role Tool Bar',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: TrixtaRoleToolbar,
  });
});
addons.setConfig({
  theme,
});
