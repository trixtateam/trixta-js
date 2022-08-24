export const DEFAULT_TRIXTA_ROLE = 'everyone_anon';
export const DEFAULT_TRIXTA_SPACE = 'trixta-demo.space.trixta.io';

export const DEFAULT_TRIXTA_ROLES = ['everyone_anon', 'everyone_authed'];
export const DEFAULT_TRIXTA_ACTIONS = {
  [DEFAULT_TRIXTA_ROLES[0]]: ['everyone_anon_action', 'everyone_anon_action2'],
  [DEFAULT_TRIXTA_ROLES[1]]: ['everyone_authed_action', 'everyone_authed_action2'],
};
export const DEFAULT_TRIXTA_REACTIONS =  {
  [DEFAULT_TRIXTA_ROLES[0]]: ['everyone_anon_reaction', 'everyone_anon_reaction2'],
  [DEFAULT_TRIXTA_ROLES[1]]: ['everyone_authed_reaction', 'everyone_authed_reaction2'],
};
