// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
import debug, { Debugger } from 'debug';
import {
  TrixtaDebugType,
  TrixtaInstanceDebuggerParameters,
  TrixtaInstancesDebuggerParameters,
} from './types';
debug.log = console.debug.bind(console);

const trixtalogger = debug('TRIXTA');
const logReaction = trixtalogger.extend('REACTION');
const logAction = trixtalogger.extend('ACTION');

debug.enable('TRIXTA:*');

export const getTrixtaDebug = (debugType: TrixtaDebugType): Debugger =>
  debugType === TrixtaDebugType.Reaction ? logReaction : logAction;

/**
 *
 * @param parameters
 */
export const trixtaDebugger = ({
  debugMode,
  roleName,
  common,
  name,
  hasRoleAccess,
  instances,
  type,
}: TrixtaInstancesDebuggerParameters): void => {
  if (debugMode) {
    const trixtaDebug = getTrixtaDebug(type);
    trixtaDebug('ROLE NAME: %s', roleName);
    trixtaDebug('NAME: %s', name);
    trixtaDebug('HAS ACCESS: %s', hasRoleAccess);
    if (!hasRoleAccess) return;
    trixtaDebug('COMMON: %O', common);
    trixtaDebug('INSTANCES: %O', instances);
    trixtaDebug('--------------------------');
  }
};

export const trixtaInstanceDebugger = ({
  debugMode,
  response,
  roleName,
  name,
  instance,
  type,
}: TrixtaInstanceDebuggerParameters): void => {
  if (debugMode) {
    const trixtaDebug = getTrixtaDebug(type);
    trixtaDebug('TYPE: %s', type);
    trixtaDebug('ROLE NAME: %s', roleName);
    trixtaDebug('NAME: %s', name);
    trixtaDebug('INSTANCE: %O', instance);
    trixtaDebug('--------------------------');
    if (!response) return;
    const { error, success } = response as { error: unknown; success: unknown };
    if (error) trixtaDebug('ERROR: %O', error);
    if (success) trixtaDebug('RESPONSE: %O', success);
    trixtaDebug('--------------------------');
  }
};
