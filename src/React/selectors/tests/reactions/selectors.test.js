import { get, getReducerKeyName, pickBy } from '../../../../utils';
import { TRIXTA_FIELDS } from '../../../constants';
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

    it('selectTrixtaReactions', () => {
      const expectedResult = mockedState.trixta.reactions;

      expect(
        trixtaReactionSelectors.selectTrixtaReactions(mockedState),
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
      const trixtaReactions = trixtaReactionSelectors.selectTrixtaReactions(
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
        trixtaReactionSelectors.selectTrixtReactionStateSelector(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    describe('selectors for TrixtaReaction loading status For Role', () => {
      it('makeSelectIsTrixtaReactionInProgress for existing role', () => {
        const selector = trixtaReactionSelectors.makeSelectIsTrixtaReactionInProgress();
        const status = trixtaReactionSelectors.selectTrixtReactionRequestStatusSelector(
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
        const status = trixtaReactionSelectors.selectTrixtReactionRequestStatusSelector(
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
      const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
        mockedState,
        props,
      );

      let expectedResult = selectedReaction;

      expect(selector(mockedState, props)).toEqual(expectedResult);
    });

    it('makeSelectTrixtaReactionCommonForRole', () => {
      const selector = trixtaReactionSelectors.makeSelectTrixtaReactionCommonForRole();
      const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
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
      const trixtaReactions = trixtaReactionSelectors.selectTrixtaReactions(
        mockedState,
      );

      const expectedResult = pickBy(
        trixtaReactions,
        (value, key) => key && key.split(':', 1)[0] === roleName,
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
        const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult = selectedReaction
          ? selectedReaction?.instances[
              requestForEffect
                ? TRIXTA_FIELDS.requestForEffect
                : TRIXTA_FIELDS.requestForResponse
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
        const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult = selectedReaction
          ? selectedReaction?.instances[
              requestForEffect
                ? TRIXTA_FIELDS.requestForEffect
                : TRIXTA_FIELDS.requestForResponse
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
        const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult =
          selectedReaction?.instances[
            requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
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
        const selectedReaction = trixtaReactionSelectors.selectTrixtReactionStateSelector(
          mockedState,
          props,
        );

        let expectedResult =
          selectedReaction?.instances[
            requestForEffect
              ? TRIXTA_FIELDS.requestForEffect
              : TRIXTA_FIELDS.requestForResponse
          ][instanceIndex];

        expect(selector(mockedState, props)).toEqual(expectedResult);
      });
    });
  });
});
