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
import { trixtaReactionSelectors } from '../../index';

describe('Trixta Selectors', () => {
  describe('Reactions related Selectors', () => {
    let props;
    beforeEach(() => {
      props = {
        roleName: 'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
        reactionName: 'pause_queue',
      };
    });

    it('getTrixtaReactionsState', () => {
      const expectedResult = mockedState.trixta.reactions;

      expect(
        trixtaReactionSelectors.getTrixtaReactionsState(mockedState),
      ).toEqual(expectedResult);
    });

    it('selectTrixtReactionsStateSelector', () => {
      const expectedResult = trixtaReactionSelectors.getTrixtaReactionsState(
        mockedState,
      );

      expect(
        trixtaReactionSelectors.selectTrixtaReactionsStateSelector(mockedState),
      ).toEqual(expectedResult);
    });

    it('selectTrixtaReactionNameProp', () => {
      const expectedResult = props.reactionName;

      expect(
        trixtaReactionSelectors.selectTrixtaReactionNameProp(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    it('selectTrixtReactionStateSelector', () => {
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const reactionName = trixtaReactionSelectors.selectTrixtaReactionNameProp(
        mockedState,
        props,
      );
      const trixtaReactions = trixtaReactionSelectors.getTrixtaReactionsState(
        mockedState,
      );
      const expectedResult = trixtaReactions[
        getReducerKeyName({ name: reactionName, role: roleName })
      ]
        ? trixtaReactions[
            getReducerKeyName({ name: reactionName, role: roleName })
          ]
        : undefined;

      expect(
        trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    it('selectTrixtReactionRequestStatusSelector', () => {
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const reactionName = trixtaReactionSelectors.selectTrixtaReactionNameProp(
        mockedState,
        props,
      );
      const loadingStatusRef = commonSelectors.selectTrixtaLoadingStatusRefProp(
        mockedState,
        props,
      );
      const trixtaReactions = trixtaReactionSelectors.getTrixtaReactionsState(
        mockedState,
      );

      const requestStatusKey = getRequestStatusKeyName({
        name: reactionName,
        role: roleName,
        loadingStatusRef,
      });
      const keyName = getReducerKeyName({ name: reactionName, role: roleName });

      const expectedResult =
        trixtaReactions[keyName] &&
        trixtaReactions[keyName].requestStatus[requestStatusKey]
          ? trixtaReactions[keyName].requestStatus[requestStatusKey]
          : undefined;

      expect(
        trixtaReactionSelectors.selectTrixtaReactionRequestStatusSelector(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    describe('selectors for TrixtaReaction loading status For Role', () => {
      it('makeSelectIsTrixtaReactionInProgress for existing role', () => {
        const selector = trixtaReactionSelectors.makeSelectIsTrixtaReactionInProgress();
        const status = trixtaReactionSelectors.selectTrixtaReactionRequestStatusSelector(
          mockedState,
          props,
        );
        const expectedResult = status
          ? status === RequestStatus.REQUEST
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(selector(mockedState, props)).toEqual(false);
      });

      it('makeSelectIsTrixtaReactionInProgress for non existing role', () => {
        props.roleName = 'unknown';
        const selector = trixtaReactionSelectors.makeSelectIsTrixtaReactionInProgress();
        const status = trixtaReactionSelectors.selectTrixtaReactionRequestStatusSelector(
          mockedState,
          props,
        );
        const expectedResult = status
          ? status === RequestStatus.REQUEST
          : false;

        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(selector(mockedState, props)).toEqual(false);
      });
    });

    it('makesSelectTrixtaReactionForRole', () => {
      const selector = trixtaReactionSelectors.makesSelectTrixtaReactionForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
        mockedState,
        props,
      );

      let expectedResult = selectedReaction;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    describe('makesSelectIsTrixtaReactionReadyForRole', () => {
      it('makesSelectIsTrixtaReactionReadyForRole should return true if exists', () => {
        const selector = trixtaReactionSelectors.makesSelectIsTrixtaReactionReadyForRole();
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedReaction !== undefined;
        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(expectedResult).toEqual(true);
      });

      it('makesSelectIsTrixtaReactionReadyForRole should return false if does not exist', () => {
        const selector = trixtaReactionSelectors.makesSelectIsTrixtaReactionReadyForRole();
        props.reactionName = 'nonense';
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );
        const expectedResult = selectedReaction !== undefined;
        expect(selector(mockedState, props)).toEqual(expectedResult);
        expect(expectedResult).toEqual(false);
      });
    });

    it('makeSelectTrixtaReactionCommonForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionCommonForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
        mockedState,
        props,
      );

      let expectedResult = get(selectedReaction, `common`, undefined);

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionsForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionsForRole();
      const roleName = commonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const trixtaReactions = trixtaReactionSelectors.getTrixtaReactionsState(
        mockedState,
      );
      const trixtaReactionsForRole = pickBy(
        trixtaReactions,
        (_, key) => key && key.split(':', 1)[0] === roleName,
      );
      const expectedResult = Object.entries(trixtaReactionsForRole).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value,
      );

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    describe('selectors for TrixtaReaction Response Instances For Role', () => {
      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const requestForEffect = trixtaReactionSelectors.selectTrixtaReactionTypeProp(
          mockedState,
          props,
        );
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult = selectedReaction
          ? selectedReaction?.instances[
              requestForEffect ? 'requestForEffect' : 'requestForResponse'
            ]
          : [];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makeSelectTrixtaReactionResponseInstancesForRole using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        const selector = trixtaReactionSelectors.makeSelectTrixtaReactionResponseInstancesForRole();
        const requestForEffect = trixtaReactionSelectors.selectTrixtaReactionTypeProp(
          mockedState,
          props,
        );
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult = selectedReaction
          ? selectedReaction?.instances[
              requestForEffect ? 'requestForEffect' : 'requestForResponse'
            ]
          : [];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });

    describe('selectors for TrixtaReaction Response Instance For Role', () => {
      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = true', () => {
        props.requestForEffect = true;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const requestForEffect = trixtaReactionSelectors.selectTrixtaReactionTypeProp(
          mockedState,
          props,
        );
        const instanceIndex = trixtaReactionSelectors.selectTrixtaReactionInstanceIndexProp(
          mockedState,
          props,
        );
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult =
          selectedReaction?.instances[
            requestForEffect ? 'requestForEffect' : 'requestForResponse'
          ][instanceIndex];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });

      it('makesSelectTrixtaReactionResponseInstance using props.requestForEffect = false', () => {
        props.requestForEffect = false;
        props.instanceIndex = 0;
        const selector = trixtaReactionSelectors.makesSelectTrixtaReactionResponseInstance();
        const requestForEffect = trixtaReactionSelectors.selectTrixtaReactionTypeProp(
          mockedState,
          props,
        );
        const instanceIndex = trixtaReactionSelectors.selectTrixtaReactionInstanceIndexProp(
          mockedState,
          props,
        );
        const selectedReaction = trixtaReactionSelectors.selectTrixtaReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult =
          selectedReaction?.instances[
            requestForEffect ? 'requestForEffect' : 'requestForResponse'
          ][instanceIndex];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });
  });
});
