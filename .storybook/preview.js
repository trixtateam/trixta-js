import { DocsContainer, DocsPage } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import "bootstrap/dist/css/bootstrap.min.css";
import ReduxDecorator from '../src/stories/utils/ReduxDecorator';
export const parameters = {
  controls: { expanded: true },
  status: {
    statuses: {
      released: {
        background: '#14DCAF',
        color: '#ffffff',
        description: 'This is stable and released',
      },
      beta: {
        background: '#E449B2',
        color: '#ffffff',
        description: 'This could change in the future',
      },
      stable: {
        background: '#5E02FF',
        color: '#ffffff',
        description: 'This is stable',
      },
      new: {
        background: '#36C0F7',
        color: '#ffffff',
        description: 'This is new and experimental',
      },
    },
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
    theme: themes.light,
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Getting Started',
        'Changelog',
        'Common',
        'Actions',
        'Reactions',
      ],
    },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [ReduxDecorator()];
