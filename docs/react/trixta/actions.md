 ## Redux Actions
 ```JS
 /**
 *  Listened for the in the trixta saga to check roles to add and react on
 * @param {Object} params
 * @param {Array} params.roles - roles
 */
export function updateTrixtaRoles({ roles }) {
  return {
    type: UPDATE_TRIXTA_ROLES,
    data: {
      roles,
    },
  };
}
 ```
