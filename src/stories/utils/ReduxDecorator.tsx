import { DecoratorFn } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

export const withStore: DecoratorFn = (Story) => {
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
