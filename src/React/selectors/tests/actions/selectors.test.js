import { get, getReducerKeyName, pickBy } from '../../../../utils';
// eslint-disable-next-line jest/no-mocks-import
import { mockedState } from '../../../reducers/__mocks__/trixtaState';
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

    it('selectTrixtaActions', () => {
      const expectedResult = mockedState.trixta.actions;

      expect(trixtaActionSelectors.selectTrixtaActions(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaActionNameProp', () => {
      const expectedResult = props.actionName;

      expect(trixtaActionSelectors.selectTrixtaActionNameProp(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    it('selectTrixtActionStateSelector', () => {
      const roleName = commonSelectors.selectTrixtaRoleNameProp(mockedState, props);
      const actionName = trixtaActionSelectors.selectTrixtaActionNameProp(mockedState, props);
      const trixtaActions = trixtaActionSelectors.selectTrixtaActions(mockedState);
      const expectedResult = trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
        ? trixtaActions[getReducerKeyName({ name: actionName, role: roleName })]
        : undefined;

      expect(trixtaActionSelectors.selectTrixtActionStateSelector(mockedState, props)).toEqual(
        expectedResult,
      );
    });

    describe('selectors for TrixtaAction Response Instances For Role', () => {
      it('makeSelectTrixtaActionResponseInstancesForRole for existing role', () => {
        const selector = trixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction ? selectedAction.instances : [];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makeSelectTrixtaActionResponseInstancesForRole for non existing role', () => {
        props.roleName = 'unknown';
        const selector = trixtaActionSelectors.makeSelectTrixtaActionResponseInstancesForRole();
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
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
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction ? selectedAction.instances[instanceIndex] : undefined;

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
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction ? selectedAction.instances[instanceIndex] : undefined;

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
      const roleName = commonSelectors.selectTrixtaRoleNameProp(mockedState, props);
      const trixtaActions = trixtaActionSelectors.selectTrixtaActions(mockedState);
      const expectedResult = pickBy(
        trixtaActions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
      );
      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    describe('selectors for TrixtaAction loading status For Role', () => {
      it('makeSelectIsTrixtaActionInProgress for existing role', () => {
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction
          ? get(selectedAction.loadingStatus, 'status', false)
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(selector(mockedState, props)).toEqual(false);
      });

      it('makeSelectIsTrixtaActionInProgress for existing role and actionName', () => {
        props.actionName = 'get_profile';
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();
        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction
          ? get(selectedAction.loadingStatus, 'status', false)
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);

        expect(selector(mockedState, props)).toEqual(true);
      });

      it('makeSelectIsTrixtaActionInProgress for non existing role', () => {
        props.roleName = 'unknown';
        const selector = trixtaActionSelectors.makeSelectIsTrixtaActionInProgress();

        const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedAction
          ? get(selectedAction.loadingStatus, 'status', false)
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    it('makeSelectTrixtaActionCommonForRole', () => {
      const selector = trixtaActionSelectors.makeSelectTrixtaActionCommonForRole();
      const selectedAction = trixtaActionSelectors.selectTrixtActionStateSelector(
        mockedState,
        props,
      );

      let expectedResult = get(selectedAction, `common`, undefined);

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });
  });
});
