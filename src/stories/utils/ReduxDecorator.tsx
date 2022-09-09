import { StoryFn } from '@storybook/addons'
import { DecoratorFn } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'


export const withStore: DecoratorFn = (Story:StoryFn) => {
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  )
}

