import { create } from '@storybook/theming/create';
import packageJson from '@trixtateam/trixta-js-core/package.json';

export default create({
  base: 'dark',
  brandTitle: `${packageJson.name} ${packageJson.version}`,
  brandUrl: 'https://trixta.com',
  brandImage: 'https://raw.githubusercontent.com/trixtateam/trixta-js/master/docs/images/trixta-logo.png',
});