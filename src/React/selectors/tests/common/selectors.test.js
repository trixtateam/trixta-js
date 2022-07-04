import { get } from '../../../../utils';
// eslint-disable-next-line jest/no-mocks-import
import {
  mockedState,
  trixtaState,
} from '../../../reducers/__mocks__/trixtaState';
import * as trixtaCommonSelectors from '../../common';

describe('Trixta Selectors', () => {
  describe('Common Selectors', () => {
    it('selectTrixtaAgentDetails', () => {
      const expectedResult = trixtaState.agentDetails;

      expect(
        trixtaCommonSelectors.selectTrixtaAgentDetails(mockedState),
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAgentDetails', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAgentDetails();
      const expectedResult = trixtaState.agentDetails;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizingStatus', () => {
      const expectedResult = trixtaState.authorizingStatus;
      expect(
        trixtaCommonSelectors.selectTrixtaAuthorizingStatus(mockedState),
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAuthorizingStatus', () => {
      const selector = trixtaCommonSelectors.makeSelectTrixtaAuthorizingStatus();
      const authorizingStatus = trixtaCommonSelectors.selectTrixtaAuthorizingStatus(
        mockedState,
      );
      const expectedResult = authorizingStatus;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizingStatusForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const expectedResult = trixtaState.authorizingStatus[props.roleName];

      expect(
        trixtaCommonSelectors.selectTrixtaAuthorizingStatusForRole(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    it('makeSelectTrixtaAuthorizingStatusForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const selector = trixtaCommonSelectors.makeSelectTrixtaAuthorizingStatusForRole();
      const roleName = trixtaCommonSelectors.selectTrixtaRoleNameProp(
        mockedState,
        props,
      );
      const authorizingStatus = trixtaCommonSelectors.selectTrixtaAuthorizingStatus(
        mockedState,
        props,
      );
      const expectedResult = authorizingStatus[roleName];

      expect(selector(mockedState, props)).toEqual(expectedResult);
      expect(expectedResult).toEqual({ status: true });
    });

    it('selectIsTrixtaAuhorizedForRole', () => {
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const expectedResult =
        trixtaState.authorizingStatus[props.roleName] &&
        get(trixtaState.authorizingStatus[props.roleName], 'status', false);

      expect(
        trixtaCommonSelectors.selectIsTrixtaAuhorizedForRole(
          mockedState,
          props,
        ),
      ).toEqual(expectedResult);
    });

    it('selectTrixtaAuthorizationStarted', () => {
      const expectedResult = trixtaState.authorizationStarted;

      expect(
        trixtaCommonSelectors.selectTrixtaAuthorizationStarted(mockedState),
      ).toEqual(expectedResult);
    });

    it('makeSelectHasTrixtaAuthorizationStarted', () => {
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaAuthorizationStarted();
      const authorizationStarted = trixtaCommonSelectors.selectTrixtaAuthorizationStarted(
        mockedState,
      );
      const expectedResult = authorizationStarted;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    it('selectIsTrixtaAuhorized', () => {
      const expectedResult =
        Object.keys(trixtaState.authorizingStatus).length === 0;

      expect(
        trixtaCommonSelectors.selectIsTrixtaAuhorized(mockedState),
      ).toEqual(expectedResult);
    });

    it('makeSelectIsTrixtaAuhorized', () => {
      const selector = trixtaCommonSelectors.makeSelectIsTrixtaAuhorized();
      const authorized = trixtaCommonSelectors.selectIsTrixtaAuhorized(
        mockedState,
      );
      const expectedResult = authorized;

      expect(selector(mockedState)).toEqual(expectedResult);
    });

    describe('selectHasTrixtaRoleAccess', () => {
      it('selectHasTrixtaRoleAccess should return true', () => {
        const props = {
          roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        };
        const expectedResult = true;

        expect(
          trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props),
        ).toEqual(expectedResult);
      });

      it('selectHasTrixtaRoleAccess should return false', () => {
        const props = { roleName: 'anonymous' };
        const expectedResult = false;

        expect(
          trixtaCommonSelectors.selectHasTrixtaRoleAccess(mockedState, props),
        ).toEqual(expectedResult);
      });
    });

    it('makeSelectHasTrixtaRoleAccess', () => {
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccess();
      const props = { roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]' };
      const hasAccess = trixtaCommonSelectors.selectTrixtaRoleAccessSelector(
        mockedState,
        props,
      );
      const expectedResult = hasAccess;

      expect(selector(mockedState, props)).toEqual(expectedResult);
      expect(expectedResult).toEqual(true);
    });

    it('makeSelectHasTrixtaRoleAccessForRole', () => {
      const trixtaRoles = [
        'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        'host[d1be63be-c0e4-4468-982c-5c04714a2987]',
      ];
      const props = { roleName: trixtaRoles[0] };
      const selector = trixtaCommonSelectors.makeSelectHasTrixtaRoleAccessForRole();
      const hasAccess = trixtaCommonSelectors.selectHasTrixtaRoleAccess(
        mockedState,
        props,
      );

      let expectedResult = false;
      expectedResult = hasAccess;

      expect(selector(mockedState, props)).toEqual(expectedResult);
      expect(expectedResult).toEqual(true);
    });
  });
});
