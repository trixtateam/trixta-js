## Reducer
```JS
export const initialState = {
  reactions: {},
  actions: {},
  error: false,
  schemaFormSettings: {
    showErrorList: false,
    noHtml5Validate: true,
    liveValidate: false,
    liveOmit: false,
    omitExtraData: false,
    safeRenderCompletion: false,
  },
  agentDetails: [],
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
const trixtaReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_TRIXTA_ERROR:
        draft.error = _.isObjectLike(action.error)
          ? getMessageFromError(action.error)
          : action.error;
        break;
      case UPDATE_TRIXTA_ROLES:
        draft.agentDetails = _.get(action, 'data.roles', []);
        break;
      case SUBMIT_REACTION_RESPONSE_FAILURE:
        {
          const reactionName = _.get(action, 'error.reactionName');
          const roleName = _.get(action, 'error.roleName');
          const ref = _.get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (
            draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ][ref]
          ) {
            draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ][ref].response = {
              error: _.get(action, 'error'),
              success: false,
            };
          }
        }
        break;
      case SUBMIT_REACTION_RESPONSE_SUCCESS:
        {
          const reactionName = _.get(action, 'data.reactionName');
          const roleName = _.get(action, 'data.roleName');
          const ref = _.get(action.data, ROLE_REACTION_RESPONSE_FIELDS.ref, '');
          const keyName = getReducerKeyName({
            name: reactionName,
            role: roleName,
          });
          if (
            draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ][ref]
          ) {
            draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ][ref].response = {
              error: false,
              success: _.get(action, 'data'),
            };
          }
        }
        break;
      case UPDATE_REACTION_RESPONSE:
        {
          const keyName = _.get(action, 'data.keyName', null);
          const reactionDetails = _.get(action, 'data.reaction', {});
          const reaction = getReactionDetails({
            reaction: reactionDetails,
          });
          const ref = _.get(reaction, ROLE_REACTION_RESPONSE_FIELDS.ref, false);
          const { mode } = state.reactions[keyName];
          const isExpired =
            _.get(reaction, ROLE_REACTION_RESPONSE_FIELDS.status, '') ===
            'expired';
          if (isExpired) {
            delete draft.reactions[keyName].instances[
              TRIXTA_FIELDS.requestForResponse
            ][ref];
          } else if (draft.reactions[keyName]) {
            if (ref) {
              draft.reactions[keyName].instances[
                TRIXTA_FIELDS.requestForResponse
              ][ref] = {
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              };
            } else if (!mode) {
              draft.reactions[keyName].instances[
                TRIXTA_FIELDS.requestForEffect
              ][0] = {
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              };
            } else {
              draft.reactions[keyName].instances[
                TRIXTA_FIELDS.requestForEffect
              ].push({
                details: reaction,
                response: {
                  success: false,
                  error: false,
                },
              });
            }
          }
        }
        break;
      case UPDATE_ACTION:
        {
          const actionDetails = _.get(action, 'data.action');
          const keyName = _.get(action, 'data.keyName', null);
          draft.actions[keyName] = getReducerStructure({
            details: actionDetails,
          });
        }
        break;
      case UPDATE_REACTION:
        {
          const reactionDetails = _.get(action, 'data.reaction');
          const keyName = _.get(action, 'data.keyName', null);
          draft.reactions[keyName] = getReducerStructure({
            details: reactionDetails,
            type: 'reaction',
          });
        }
        break;
      case UPDATE_ACTION_RESPONSE:
        {
          const keyName = _.get(action, 'data.keyName', null);
          if (!_.get(action, 'data.clearResponse', false)) {
            draft.actions[keyName].instances.push({
              response: {
                success: _.get(action, 'data.response'),
                error: false,
              },
            });
          } else {
            draft.actions[keyName].instances = [];
          }
        }
        break;
      case SUBMIT_ACTION_RESPONSE_FAILURE:
        {
          const actionName = _.get(action, 'data.actionName');
          const roleName = _.get(action, 'data.roleName');
          const keyName = getReducerKeyName({
            name: actionName,
            role: roleName,
          });
          draft.actions[keyName].instances.push({
            response: {
              error: _.get(action, 'error'),
              success: false,
            },
          });
        }
        break;
      default:
        return state;
    }
  });
export default trixtaReducer;

```



<img src="../images/reducer_structure.png" alt="reducer structure" align="center" />





