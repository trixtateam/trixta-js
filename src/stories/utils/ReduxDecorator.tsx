import { StoryFn } from '@storybook/addons'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'


export default () => {
  return (story: StoryFn) => {
    return (<Provider store={store}> {story()} </Provider>)
  }}

