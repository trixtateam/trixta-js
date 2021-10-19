import { Args } from '@storybook/addons';
import {
  TRIXTA_ACTION_KEY,
  TRIXTA_REACTION_KEY,
  TRIXTA_ROLE_KEY,
} from '../toolbars/trixta-role/constants';

export const getGlobalValue = (
  args: Args,
  keyName: string,
  defaultValue?: string,
) => {
  const { globals } = args;
  const globalValue = globals[keyName];
  if (globalValue) return globalValue;
  return defaultValue;
};

export const getGlobalsRoleName = (args: Args, defaultValue?: string) => {
  return getGlobalValue(args, TRIXTA_ROLE_KEY, defaultValue);
};

export const getGlobalsActionName = (args: Args, defaultValue?: string) => {
  return getGlobalValue(args, TRIXTA_ACTION_KEY, defaultValue);
};

export const getGlobalsReactionName = (args: Args, defaultValue?: string) => {
  return getGlobalValue(args, TRIXTA_REACTION_KEY, defaultValue);
};
