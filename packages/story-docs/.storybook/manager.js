
import { addons, types } from '@storybook/addons';
import {
  ADDON_ID,
  TOOL_ID
} from '../src/stories/../toolbars/trixta-role/constants';
import  TrixtaRoleToolbar  from '../src/toolbars/trixta-role/trixta-toolbar';
import theme from './theme.js';

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
  showToolbar: true,
  theme,
});