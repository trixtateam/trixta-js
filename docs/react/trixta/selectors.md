## Selectors
```JS
/**
 * Selects all the roles
 * @param {*} state
 */
const selectAgentDetails = (state) => state.trixta.agentDetails;
```

```JS
/**
 * Selects the roles for the given props.roleName and checks if included
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectHasRoleAccess = (state, props) =>
  _.includes(state.trixta.agentDetails, props.roleName);
```

```JS
/**
 * Selects default schema form settings
 * @param {*} state
 */
const selectSchemaFormSettings = (state) => state.trixta.schemaFormSettings;
```

## Action Selectors
```JS
/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName, props.actionName and returns the action
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionForRole = (state, props) =>
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ];
```

```JS
/**
 * Selects the actions[props.roleName:props.actionName].instances for the given props.roleName,props.actionName and returns the action instances
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 */
const selectActionResponseInstancesForRole = (state, props) =>
  _.get(
    state.trixta.actions,
    `${getReducerKeyName({
      name: props.actionName,
      role: props.roleName,
    })}.instances`,
    [],
  );
```

```JS
/**
 * Selects the actions[props.roleName:props.actionName].instances[props.instanceIndex]
 * for the given props.roleName ,  props.actionName and returns the action instance response
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.actionName - name of action
 * @param {String} props.instanceIndex - index for action instance
 */
const selectActionResponseInstance = (state, props) =>
  state.trixta.actions[
    getReducerKeyName({ name: props.actionName, role: props.roleName })
  ].instances[props.instanceIndex];
```

```JS
/**
 * Selects the actions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectActionsForRole = (state, props) =>
  _.pickBy(
    state.trixta.actions,
    (value, key) => _.split(key, ':', 1)[0] === props.roleName,
  );
```

```JS
/**
 * Returns the common for the  props.actionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.actionName
 */
// eslint-disable-next-line no-unused-vars
const makeSelectActionCommonForRole = (state, props) =>
  createSelector(selectActionForRole, (selectedAction) => {
    if (selectedAction) {
      return _.get(selectedAction, `common`, {});
    }

    return {};
  });
```

## Reaction Selectors
```JS
/**
 * Selects the actions[props.roleName:props.actionName]
 * for the given props.roleName ,  props.reactionName and returns the reaction
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 */
const selectReactionForRole = (state, props) =>
  state.trixta.reactions[
    getReducerKeyName({ name: props.reactionName, role: props.roleName })
  ];
```

```JS
/**
 * Selects the reactions for given props.roleName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 */
const selectReactionsForRole = (state, props) =>
  _.pickBy(
    state.trixta.reactions,
    (value, key) => _.split(key, ':', 1)[0] === props.roleName,
  );
```

```JS
/**
 * Selects the reactions[props.roleName:props.reactionName].instances
 * for the given props.roleName ,  props.reactionName and returns the reaction instances for requestForEffect or requestForResponse
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
 */
const selectReactionResponseInstancesForRole = (state, props) =>
  _.get(
    state.trixta.reactions,
    `${getReducerKeyName({
      name: props.reactionName,
      role: props.roleName,
    })}.instances.${
      props.requestForEffect
        ? TRIXTA_FIELDS.requestForEffect
        : TRIXTA_FIELDS.requestForResponse
    }`,
    props.requestForEffect ? [] : {},
  );
```

```JS
/**
 * Selects the reactions[props.roleName:props.reactionName].instances[props.instanceRef]
 * for the given props.roleName , props.reactionName and returns the reaction response instance
 * @param {*} state
 * @param {Object} props
 * @param {String} props.roleName - name of role
 * @param {String} props.reactionName - name of reaction
 * @param {String} props.instanceRef - ref for reaction instance
 * @param {String} props.instanceIndex - index for reaction instance
 * @param {boolean} props.requestForEffect - true if reaction is requestForEffect
 */
const selectReactionResponseInstance = (state, props) =>
  _.get(
    state.trixta.reactions,
    `${getReducerKeyName({
      name: props.reactionName,
      role: props.roleName,
    })}.instances.${
      props.requestForEffect
        ? TRIXTA_FIELDS.requestForEffect
        : TRIXTA_FIELDS.requestForResponse
    }`,
    props.requestForEffect ? [] : {},
  )[props.requestForEffect ? props.instanceIndex : props.instanceRef];
```

```JS
/**
 * Returns the common for the props.reactionName
 * @param {*} state
 * @param {Object} props
 * @param {String} props.reactionName
 */
const makeSelectReactionCommonForRole = () =>
  createSelector(selectReactionForRole, (selectedReaction) => {
    if (selectedReaction) {
      return _.get(selectedReaction, `common`, {});
    }

    return {};
  });
```
