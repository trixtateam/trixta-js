import { get, pickBy } from '../../../../utils';
import { TRIXTA_FIELDS } from '../../../constants';
// eslint-disable-next-line jest/no-mocks-import
import { mockedState } from '../../../reducers/__mocks__/trixtaState';
import { getTrixtaReactionState } from '../../index';
import * as trixtaReactionSelectors from '../../trixtaReactions';
describe('Trixta Selectors', () => {
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

    describe('selectors for TrixtaReaction loading status For Role', () => {
      it('selectTrixtaReactionLoadingStatus for existing role', () => {
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).loadingStatus;

        expect(
          trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props),
        ).toEqual(expectedResult);
        props.reactionName = 'host_to_guest';
        expect(
          trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props),
        ).toEqual({
          status: true,
        });
      });
      it('selectTrixtaReactionLoadingStatus for non existing role', () => {
        props.roleName = 'unknown';
        const expectedResult =
          getTrixtaReactionState(mockedState, props) &&
          getTrixtaReactionState(mockedState, props).loadingStatus;

        expect(
          trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props),
        ).toEqual(expectedResult);
        props.reactionName = 'host_to_guest';
        expect(
          trixtaReactionSelectors.selectTrixtaReactionLoadingStatus(mockedState, props),
        ).toEqual(undefined);
      });

      it('makeSelectIsTrixtaReactionInProgress for non existing role', () => {
        props.roleName = 'unknown';
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
