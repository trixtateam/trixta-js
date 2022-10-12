import {
  get,
  getReducerKeyName,
  getRequestStatusKeyName,
  pickBy,
} from '../../../../utils';
// eslint-disable-next-line jest/no-mocks-import
import { mockedState } from '../../../reducers/__mocks__/trixtaState';
import { RequestStatus } from '../../../types';
import * as commonSelectors from '../../common';
import { trixtaActionSelectors } from '../../index';
describe('Trixta Selectors', () => {
  describe('Actions related Selectors', () => {
    let props;

    beforeEach(() => {
      props = {
        roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        actionName: 'add_to_queue',
      };
    });

    it('getTrixtaActionsState', () => {
      const expectedResult = mockedState.trixta.actions;

      expect(trixtaActionSelectors.getTrixtaActionsState(mockedState)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtActionsStateSelector', () => {
      const expectedResult = trixtaActionSelectors.getTrixtaActionsState(
        mockedState,
      );

      expect(
        trixtaActionSelectors.selectTrixtaActionsStateSelector(mockedState),
      ).toEqual(expectedResult);
    });

    it('selectTrixtaActionNameProp', () => {
      const expectedResult = props.actionName;

      expect(
        trixtaActionSelectors.selectTrixtaActionNameProp(mockedState, props),
      ).toEqual(expectedResult);
    });

    it('selectTrixtActionStateSelector', () => {
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const actionName = trixtaActionSelectors.selectTrixtaActionNameProp(
        mockedState,
        props,
      );
      const trixtaActions = trixtaActionSelectors.selectTrixtaActionsStateSelector(
        mockedState,
      );
      const expectedResult = trixtaActions[
        getReducerKeyName({ name: actionName, role: roleName })
      ]
        ? trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
        : undefined;

      expect(
        trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    it('selectTrixtActionRequestStatusSelector', () => {
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const actionName = trixtaActionSelectors.selectTrixtaActionNameProp(
        mockedState,
        props,
      );
      const loadingStatusRef = commonSelectors.selectTrixtaLoadingStatusRefProp(
        mockedState,
        props,
      );
      const trixtaActions = trixtaActionSelectors.selectTrixtaActionsStateSelector(
        mockedState,
      );

      const requestStatusKey = getRequestStatusKeyName({
        name: actionName,
        role: roleName,
        loadingStatusRef,
      });
      const keyName = getReducerKeyName({ name: actionName, role: roleName });

      const expectedResult =
        trixtaActions[keyName] &&
        trixtaActions[keyName].requestStatus[requestStatusKey]
          ? trixtaActions[keyName].requestStatus[requestStatusKey]
          : undefined;

      expect(
        trixtaActionSelectors.selectTrixtaActionRequestStatusSelector(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    describe('selectors for TrixtaAction Response Instances For Role', () => {
      it('makeSelectTrixtaActionResponseInstancesForRole for existing role', () => {
        const selector = trixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction ? selectedAction.instances : [];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makeSelectTrixtaActionResponseInstancesForRole for non existing role', () => {
        props.roleName = 'unknown';
        const selector = trixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction ? selectedAction.instances : [];

        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(selector(mockedState, props)).toEqual([]);
      });
    });

    describe('selectors for TrixtaAction Response Instance For Role', () => {
      it('makesSelectTrixtaActionResponseInstance for existing role', () => {
        props.instanceIndex = 0;
        const selector = trixtaActionSelectors.makesSelectTrixtaActionResponseInstance();
        const instanceIndex = trixtaActionSelectors.selectTrixtaActionInstanceIndexProp(
          mockedState,
          props,
        );
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction
          ? selectedAction.instances[instanceIndex]
          : undefined;

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaActionResponseInstance for non existing role', () => {
        props.roleName = 'unknown';
        props.instanceIndex = 0;
        const selector = trixtaActionSelectors.makesSelectTrixtaActionResponseInstance();
        const instanceIndex = trixtaActionSelectors.selectTrixtaActionInstanceIndexProp(
          mockedState,
          props,
        );
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction
          ? selectedAction.instances[instanceIndex]
          : undefined;

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaActionInstanceResponse', () => {
        const selector = trixtaActionSelectors.makesSelectTrixtaActionInstanceResponse();
        props.instanceIndex = 0;
        const expectedResult = { success: false, error: false };

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makeSelectTrixtaActionsForRole', () => {
      const selector = trixtaActionSelectors.makeSelectTrixtaActionsForRole();
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const trixtaActions = trixtaActionSelectors.selectTrixtaActionsStateSelector(
        mockedState,
      );
      const trixtaActionsForRole = pickBy(
        trixtaActions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      );
      const expectedResult = Object.entries(trixtaActionsForRole).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value,
      );
      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    describe('makeSelectIsTrixtaActionReadyForRole', () => {
      it('makeSelectIsTrixtaActionReadyForRole should return true if exists', () => {
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionReadyForRole();
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction !== undefined;
        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(expectedResult).toEqual(true);
      });

      it('makeSelectIsTrixtaActionReadyForRole should return false if does not exist', () => {
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionReadyForRole();
        props.actionName = 'nonense';
        const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction !== undefined;
        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(expectedResult).toEqual(false);
      });
    });

    describe('selectors for TrixtaAction loading status For Role', () => {
      it('makeSelectIsTrixtaActionInProgress for existing role', () => {
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
        const status = trixtaActionSelectors.selectTrixtaActionRequestStatusSelector(
          mockedState,
          props,
        );
        const expectedResult = status
          ? status === RequestStatus.REQUEST
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(selector(mockedState, props)).toEqual(false);
      });

      it('makeSelectIsTrixtaActionInProgress for existing role and actionName', () => {
        props.actionName = 'get_profile';
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
        const status = trixtaActionSelectors.selectTrixtaActionRequestStatusSelector(
          mockedState,
          props,
        );
        const expectedResult = status
          ? status === RequestStatus.REQUEST
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);

        expect(selector(mockedState, props)).toEqual(true);
      });

      it('makeSelectIsTrixtaActionInProgress for non existing role', () => {
        props.roleName = 'unknown';
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
        const status = trixtaActionSelectors.selectTrixtaActionRequestStatusSelector(
          mockedState,
          props,
        );
        const expectedResult = status
          ? status === RequestStatus.REQUEST
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makeSelectTrixtaActionCommonForRole', () => {
      const selector = trixtaActionSelectors.makeSelectTrixtaActionCommonForRole();
      const selectedAction = trixtaActionSelectors.selectTrixtaActionStateSelector(
        mockedState,
        props,
      );

      let expectedResult = get(selectedAction, `common`, undefined);

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });
});
