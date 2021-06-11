import {
  initialState as phoenixState,
  phoenixReducer,
} from '@trixta/phoenix-to-redux';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore, Store } from 'redux';
import {
  initialState as defaultTrixtaState,
  trixtaReducer,
} from '../../React/reducers';
import { TrixtaState } from '../../React/types/common';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function createReducer() {
  return combineReducers({
    trixta: trixtaReducer,
    phoenix: phoenixReducer,
  });
}

export type AppState = Omit<
  ReturnType<ReturnType<typeof createReducer>>,
  '$CombinedState'
>;

export const storeProviderWrapper = (
  initialState: TrixtaState = defaultTrixtaState,
  initialPhoenixState = phoenixState,
): { store: Store; wrapper: React.FC } => {
  const store = createStore(createReducer(), {
    trixta: initialState,
    phoenix: initialPhoenixState,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return {
    store,
    wrapper: ({
      children,
    }: {
      children: React.ReactNode | null;
    }): React.ReactElement | null => {
      return <Provider store={store}>{children}</Provider>;
    },
  };
};
