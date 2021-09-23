import { create } from '@storybook/theming/create';
import packageJson from '../package.json';

export default create({
  base: 'light',
  brandTitle: `@trixtateam/trixta-js ${packageJson.version}`,
  brandUrl: 'https://trixta.com',
  brandImage: 'https://raw.githubusercontent.com/trixtateam/trixta-js/master/docs/images/trixta-logo.png',
  
});
