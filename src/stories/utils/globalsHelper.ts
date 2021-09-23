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

export const getGlobalsRoleName = (args: Args) => {
  return getGlobalValue(args, TRIXTA_ROLE_KEY);
};

export const getGlobalsActionName = (args: Args) => {
  return getGlobalValue(args, TRIXTA_ACTION_KEY, undefined);
};

export const getGlobalsReactionName = (args: Args) => {
  return getGlobalValue(args, TRIXTA_REACTION_KEY, undefined);
};
