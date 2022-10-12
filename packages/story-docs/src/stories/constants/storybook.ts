export const PACKAGES = {
  CORE: 'CORE',
  RJSF: 'RJSF',
};
export const DEFAULT_RJSF_ACTIONS_COMPONENTS_PATH = `${PACKAGES.RJSF}/Trixta Actions/Components/`;
export const DEFAULT_RJSF_REACTIONS_COMPONENTS_PATH = `${PACKAGES.RJSF}/Trixta Reactions/Components/`;
export const DEFAULT_WIDGETS_PATH = `${PACKAGES.RJSF}/Widgets/`;
export const DEFAULT_HOOKS_PATH = `${PACKAGES.CORE}/Common/Hooks/`;
export const DEFAULT_REACTIONS_HOOKS_PATH = `${PACKAGES.CORE}/Trixta Reactions/Hooks/`;
export const DEFAULT_ACTIONS_HOOKS_PATH = `${PACKAGES.CORE}/Trixta Actions/Hooks/`;
export const DEFAULT_COMPONENTS_PATH = `${PACKAGES.CORE}/Common/Components/`;
export const DEFAULT_ACTIONS_COMPONENTS_PATH = `${PACKAGES.CORE}/Trixta Actions/Components/`;
export const DEFAULT_REACTIONS_COMPONENTS_PATH = `${PACKAGES.CORE}/Trixta Reactions/Components/`;
export const DEFAULT_REACTIONS_SAGAS_PATH = `${PACKAGES.CORE}/Trixta Reactions/Sagas/`;
export const DEFAULT_REDUX_ACTIONS_PATH = `${PACKAGES.CORE}/Common/Redux Actions/`;
export const DEFAULT_REDUX_ACTIONS_ACTIONS_PATH = `${PACKAGES.CORE}/Trixta Actions/Redux Actions/`;
export const DEFAULT_REDUX_ACTIONS_REACTIONS_PATH = `${PACKAGES.CORE}/Trixta Reactions/Redux Actions/`;
export const DEFAULT_TRIXTA_ROLE_ARG_TYPE = {
  roleName: {
    control: { disable: true },
  },
};

export const DEFAULT_TRIXTA_ROLES_ARG_TYPE = {
  roles: {
    control: { disable: true },
  },
};

export const DEFAULT_TRIXTA_ACTION_NAME_ARG_TYPE = {
  actionName: {
    control: { disable: true },
  },
};

export const DEFAULT_TRIXTA_REACTION_NAME_ARG_TYPE = {
  reactionName: {
    control: { disable: true },
  },
};

export const DEFAULT_TRIXTA_CHILDREN_ARG_TYPE = {
  children: {
    control: { disable: true },
  },
};

export const DEFAULT_ACTION_ARG_TYPE = {
  ...DEFAULT_TRIXTA_ACTION_NAME_ARG_TYPE,
  ...DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
};

export const DEFAULT_ACTION_HOOK_ARG_TYPE = {
  ...DEFAULT_TRIXTA_ROLE_ARG_TYPE,
  ...DEFAULT_TRIXTA_ACTION_NAME_ARG_TYPE,
};

export const DEFAULT_REACTION_ARG_TYPE = {
  ...DEFAULT_TRIXTA_REACTION_NAME_ARG_TYPE,
  ...DEFAULT_TRIXTA_CHILDREN_ARG_TYPE,
};

export const DEFAULT_REACTION_HOOK_ARG_TYPE = {
  ...DEFAULT_TRIXTA_REACTION_NAME_ARG_TYPE,
};
