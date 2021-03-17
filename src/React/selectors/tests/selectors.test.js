import { get, isNullOrEmpty, pickBy } from '../../../utils';
import { TRIXTA_FIELDS } from '../../constants';
import { mockedState, trixtaState } from '../../reducers/__mocks__/trixtaState';
import * as trixtaCommonSelectors from '../common';
import { getTrixtActionState, getTrixtaReactionState } from '../index';
import * as trtixtaActionSelectors from '../trixtaActions';
import * as trixtaReactionSelectors from '../trixtaReactions';
describe('Trixta Selectors', () => {
  describe('Common Selectors', () => {
    it('selectTrixtaAgentDetails', () => {
      const expectedResult = trixtaState.agentDetails;

      expect(trixtaCommonSelectors.selectTrixtaAgentDetails(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAgentDetails', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAgentDetails();
      const expectedResult = trixtaState.agentDetails;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizingStatus', () => {
      const expectedResult = trixtaState.authorizingStatus;
      expect(trixtaCommonSelectors.selectTrixtaAuthorizingStatus(mockedState)).toEqual(
        expectedResult,
      );
    });

    it('makeSelectTrixtaAuthorizingStatus', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAuthorizingStatus();
      const authorizingStatus = trixtaCommonSelectors.selectTrixtaAuthorizingStatus(mockedState);
      const expectedResult = authorizingStatus;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizingStatus', () => {
      const expectedResult = trixtaState.authorizingStatus;
      expect(trixtaCommonSelectors.selectTrixtaAuthorizingStatus(mockedState)).toEqual(
        expectedResult,
      );
    });

    it('makeSelectTrixtaAuthorizingStatus', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAuthorizingStatus();
      const authorizingStatus = trixtaCommonSelectors.selectTrixtaAuthorizingStatus(mockedState);
      const expectedResult = authorizingStatus;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizingStatusForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const expectedResult = trixtaState.authorizingStatus[props.roleName];

      expect(
        trixtaCommonSelectors.selectTrixtaAuthorizingStatusForRole(mockedState, props),
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAuthorizingStatusForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const selector = trixtaCommonSelectors.makeSelectTrixtaAuthorizingStatusForRole();
      const authorizingStatus = trixtaCommonSelectors.selectTrixtaAuthorizingStatusForRole(
        mockedState,
        props,
      );
      const expectedResult = authorizingStatus;

      expect(selector(mockedState, props)).toEqual(expectedResult);
      expect(expectedResult).toEqual({ status: true });
    });

    it('selectIsTrixtaAuhorizedForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const expectedResult =
        trixtaState.authorizingStatus[props.roleName] &&
        get(trixtaState.authorizingStatus[props.roleName], 'status', false);

      expect(trixtaCommonSelectors.selectIsTrixtaAuhorizedForRole(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectIsTrixtaAuhorized', () => {
      const expectedResult = Object.keys(trixtaState.authorizingStatus).length === 0;

      expect(trixtaCommonSelectors.selectIsTrixtaAuhorized(mockedState)).toEqual(expectedResult);
    });

    it('makeSelectIsTrixtaAuhorized', () => {
      const selector = trixtaCommonSelectors.makeSelectIsTrixtaAuhorized();
      const authorized = trixtaCommonSelectors.selectIsTrixtaAuhorized(mockedState);
      const expectedResult = authorized;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    describe('selectHasTrixtaRoleAccess', () => {
      it('selectHasTrixtaRoleAccess should return true', () => {
        const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
        const expectedResult = true;

        expect(trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props)).toEqual(
          expectedResult,
        );
      });

      it('selectHasTrixtaRoleAccess should return false', () => {
        const props = { roleName: 'anonymous' };
        const expectedResult = false;

        expect(trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props)).toEqual(
          expectedResult,
        );
      });
    });

    it('makeSelectHasTrixtaRoleAccess', () => {
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccess();
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const roleFilter = trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props);
      const expectedResult = !!roleFilter;

      expect(selector(mockedState, props)).toEqual(expectedResult);
      expect(expectedResult).toEqual(true);
    });

    it('makeSelectHasTrixtaRoleAccessForRoles', () => {
      const roles = ['guest[d1be63be-c0e4-4468-982c-5c04714a2987]', 'everyone_anon'];
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccessForRoles();
      const agentRoles = trixtaCommonSelectors.selectTrixtaAgentDetails(mockedState);
      let expectedResult = false;
      if (isNullOrEmpty(roles)) expectedResult = false;
      if (!Array.isArray(roles)) expectedResult = false;
      expectedResult = roles.every((role) => agentRoles.includes(role));

      expect(selector(mockedState, roles)).toEqual(expectedResult);
      expect(expectedResult).toEqual(true);
    });
  });

  describe('Actions related Selectors', () => {
    let props;

    beforeEach(() => {
      props = {
        roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        actionName: 'add_to_queue',
      };
    });

    it('selectTrixtaActionForRole', () => {
      const expectedResult = getTrixtActionState(mockedState, props);

      expect(trtixtaActionSelectors.selectTrixtaActionForRole(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtaActionResponseInstancesForRole', () => {
      const expectedResult =
        getTrixtActionState(mockedState, props) && getTrixtActionState(mockedState, props).instances
          ? getTrixtActionState(mockedState, props).instances
          : [];

      expect(
        trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(mockedState, props),
      ).toEqual(expectedResult);
    });

    it('selectTrixtaActionResponseInstance', () => {
      props.instanceIndex = 0;
      const expectedResult = getTrixtActionState(mockedState, props).instances[props.instanceIndex];

      expect(trtixtaActionSelectors.selectTrixtaActionResponseInstance(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtaActionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.actions,
        (value, key) => key && key.split(':', 1)[0] === props.roleName,
      );

      expect(trtixtaActionSelectors.selectTrixtaActionsForRole(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtaActionLoadingStatus', () => {
      const expectedResult = getTrixtActionState(mockedState, props).loadingStatus;

      expect(trtixtaActionSelectors.selectTrixtaActionLoadingStatus(mockedState, props)).toEqual(
        expectedResult,
      );
      props.actionName = 'get_profile';
      expect(trtixtaActionSelectors.selectTrixtaActionLoadingStatus(mockedState, props)).toEqual({
        status: true,
      });
    });

    it('makeSelectIsTrixtaActionInProgress', () => {
      const selector = trtixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
      const loadingStatus = trtixtaActionSelectors.selectTrixtaActionLoadingStatus(
        mockedState,
        props,
      );

      let expectedResult = {};
      if (loadingStatus) {
        expectedResult = get(loadingStatus, 'status', false);
      }
      expectedResult = false;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('selectTrixtaActionCommon', () => {
      const expectedResult =
        getTrixtActionState(mockedState, props) && getTrixtActionState(mockedState, props).common;

      expect(trtixtaActionSelectors.selectTrixtaActionCommon(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtaActionResponseInstancesForRole', () => {
      const expectedResult =
        getTrixtActionState(mockedState, props) && getTrixtActionState(mockedState, props).instances
          ? getTrixtActionState(mockedState, props).instances
          : [];

      expect(
        trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(mockedState, props),
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionCommonForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionCommonForRole();
      const selectedAction = trtixtaActionSelectors.selectTrixtaActionForRole(mockedState, props);

      let expectedResult = {};
      if (selectedAction) {
        expectedResult = get(selectedAction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionResponseInstancesForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
      const selectedActionInstances = trtixtaActionSelectors.selectTrixtaActionResponseInstancesForRole(
        mockedState,
        props,
      );

      let expectedResult = [];
      if (selectedActionInstances) {
        expectedResult = selectedActionInstances;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makesSelectTrixtaActionInstanceResponse', () => {
      const selector = trtixtaActionSelectors.makesSelectTrixtaActionInstanceResponse();
      props.instanceIndex = 0;
      const expectedResult = { success: false, error: false };

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaActionsForRole', () => {
      const selector = trtixtaActionSelectors.makeSelectTrixtaActionsForRole();
      const actions = trtixtaActionSelectors.selectTrixtaActionsForRole(mockedState, props);

      const expectedResult = actions && actions;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });

  describe('Reactions related Selectors', () => {
    let props;
    beforeEach(() => {
      props = {
        roleName: 'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
        reactionName: 'pause_queue',
      };
    });

    it('selectTrixtaReactionForRole', () => {
      const expectedResult = getTrixtaReactionState(mockedState, props);

      expect(trixtaReactionSelectors.selectTrixtaReactionForRole(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtaReactionLoadingStatus', () => {
      const expectedResult = getTrixtaReactionState(mockedState, props).loadingStatus;

      expect(trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props)).toEqual(
        expectedResult,
      );
      props.reactionName = 'host_to_guest';
      expect(trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props)).toEqual(
        {
          status: true,
        },
      );
    });

    it('makeSelectIsTrixtaReactionInProgress', () => {
      const selector = trixtaReactionSelectors.makeSelectIsTrixtaReactionInProgress();
      const loadingStatus = trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(
        mockedState,
        props,
      );

      let expectedResult = {};
      if (loadingStatus) {
        expectedResult = get(loadingStatus, 'status', false);
      }
      expectedResult = false;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('selectTrixtaReactionsForRole', () => {
      const expectedResult = pickBy(
        mockedState.trixta.reactions,
        (value, key) => key && key.split(':', 1)[0] === props.roleName,
      );

      expect(trixtaReactionSelectors.selectTrixtaReactionsForRole(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    describe('selectTrixtaReactionResponseInstancesForRole', () => {
      it('selectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).instances &&
          getTrixtaReactionState(mockedState, props).instances[
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          ]
            ? getTrixtaReactionState(mockedState, props).instances[
                props.requestForEffect
                  ? TRIXTA_FIELDS.requestForEffect
                  : TRIXTA_FIELDS.requestForResponse
              ]
            : [];

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(mockedState, props),
        ).toEqual(expectedResult);
      });
      it('selectTrixtaReactionResponseInstancesForRole using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).instances &&
          getTrixtaReactionState(mockedState, props).instances[
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          ]
            ? getTrixtaReactionState(mockedState, props).instances[
                props.requestForEffect
                  ? TRIXTA_FIELDS.requestForEffect
                  : TRIXTA_FIELDS.requestForResponse
              ]
            : [];

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(mockedState, props),
        ).toEqual(expectedResult);
      });
    });

    describe('selectTrixtaReactionResponseInstance', () => {
      it('selectTrixtaReactionResponseInstance using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        props.instanceIndex = 0;
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).instances &&
          getTrixtaReactionState(mockedState, props).instances[
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          ]
            ? getTrixtaReactionState(mockedState, props).instances[
                props.requestForEffect
                  ? TRIXTA_FIELDS.requestForEffect
                  : TRIXTA_FIELDS.requestForResponse
              ][props.instanceIndex]
            : undefined;

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstance(mockedState, props),
        ).toEqual(expectedResult);
      });
      it('selectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).instances &&
          getTrixtaReactionState(mockedState, props).instances[
            props.requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          ]
            ? getTrixtaReactionState(mockedState, props).instances[
                props.requestForEffect
                  ? TRIXTA_FIELDS.requestForEffect
                  : TRIXTA_FIELDS.requestForResponse
              ][props.instanceIndex]
            : undefined;

        expect(
          trixtaReactionSelectors.selectTrixtaReactionResponseInstance(mockedState, props),
        ).toEqual(expectedResult);
      });
    });

    describe('makeSelectTrixtaReactionResponseInstancesForRole', () => {
      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(
          mockedState,
          props,
        );

        let expectedResult = [];
        if (selectedReactionInstances) {
          expectedResult = selectedReactionInstances;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const selectedReactionInstances = trixtaReactionSelectors.selectTrixtaReactionResponseInstancesForRole(
          mockedState,
          props,
        );

        let expectedResult = [];
        if (selectedReactionInstances) {
          expectedResult = selectedReactionInstances;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    describe('makesSelectTrixtaReactionResponseInstance', () => {
      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = trixtaReactionSelectors.selectTrixtaReactionResponseInstance(
          mockedState,
          props,
        );

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const selectedReactionInstance = trixtaReactionSelectors.selectTrixtaReactionResponseInstance(
          mockedState,
          props,
        );

        let expectedResult = {};
        if (selectedReactionInstance) {
          expectedResult = selectedReactionInstance;
        }

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makesSelectTrixtaReactionForRole', () => {
      const selector = trixtaReactionSelectors.makesSelectTrixtaReactionForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionForRole(
        mockedState,
        props,
      );

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = selectedReaction;
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionCommonForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionCommonForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionForRole(
        mockedState,
        props,
      );

      let expectedResult = {};
      if (selectedReaction) {
        expectedResult = get(selectedReaction, `common`, {});
      }

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionsForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionsForRole();
      const reactions = trixtaReactionSelectors.selectTrixtaReactionsForRole(mockedState, props);

      const expectedResult = reactions && reactions;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });
});
