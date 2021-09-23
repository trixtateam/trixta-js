const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);
module.exports = {
  "stories": [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  "addons": [
    '@etchteam/storybook-addon-status',
    "@storybook/addon-links",
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config) => {
    // remove scope plugin from storybook builds
    const scopePluginIndex = config.resolve.plugins.findIndex(
      ({ constructor }) =>
        constructor && constructor.name === 'ModuleScopePlugin',
    );
    config.resolve.plugins.splice(scopePluginIndex, 1);

 return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          '@emotion/react': toPath('node_modules/@emotion/react'),
          '@emotion/styled': toPath('node_modules/@emotion/styled'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
    };
  },
}
