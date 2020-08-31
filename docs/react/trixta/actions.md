```JS
/**
 * Any exception caused by trixta
 * @param {Object} params
 * @param {Object||String} params.error - error from trixta
 */
export function updateTrixtaError({ error })
```

```JS
/**
 *  Updates the actions[params.roleName:params.actionName].instances
 *  with the params.response
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {String} params.response - response from action
 * @param {Boolean?} params.clearResponse - determines if should clear the response
 */
export function updateActionResponse({
  roleName,
  clearResponse = false,
  response,
  actionName,
})
```

```JS
/**
 *  Updates the reactions[params.roleName:params.reactionName].instances
 *  with the params.reactionDetails
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {String} params.reaction - details regarding response from reaction
 */
export function updateReactionResponse({ roleName, reaction, reactionName })
```

```JS
/**
 *  Listened for the in the saga to check roles to add and react on
 * @param {Object} params
 * @param {Array} params.roles - roles
 */
export function updateTrixtaRoles({ roles })
```

```JS
/**
 *  Updates the trixta reducer actions[role:name] with
 * defaultreducer structure
 * @param {Object} params
 * @param {Object} params.role - name of role
 * @param {Object} params.action - action of role
 * @param {string} params.name - name of action
 */
export function updateAction({ role, action, name })

```

```JS
/**
 *  Updates the trixta reducer reactions[role:name] with
 * defaultreducer structure
 * @param {Object} params
 * @param {Object} params.role - name of role
 * @param {Object} params.reaction - reaction of role
 * @param {string} params.name - name of reaction
 */
export function updateReaction({ role, reaction, name })

```

```JS
/**
 *  Listened for the in the saga to do anything for the given params.role
 * @param {Object} params
 * @param {Object} params.role - role
 */
export function initializeActionsForRole({ role })
```

```JS
/**
 *  Listened for in the saga to push action to the space
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.actionName - name of action
 * @param {Object} params.formData - data to submit to space for actionName
 */
export function submitActionResponse({ formData, roleName, actionName })
```

```JS
/**
 *  Listened for in the saga to push reaction to the space
 * @param {Object} params
 * @param {String} params.roleName - name of role
 * @param {String} params.reactionName - name of reaction
 * @param {Object} params.formData - data to submit to space for reactionName
 * @param {Object} params.reactionDetails - data related to the reaction (eg ref)
 */
export function submitReactionResponse({
  formData,
  reactionDetails,
  roleName,
  reactionName,
})
```
