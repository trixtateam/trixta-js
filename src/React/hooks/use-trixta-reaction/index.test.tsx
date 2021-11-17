import { act, renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
import { getReducerKeyName } from '../../../utils';
import {
  SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
} from '../../constants/reactions';
// eslint-disable-next-line jest/no-mocks-import
import {
  mockTrixtaCommon,
  trixtaState,
} from '../../reducers/__mocks__/trixtaState';
import {
  updateTrixtaReaction,
  updateTrixtaReactionResponse,
} from '../../reduxActions';
import { useTrixtaReaction } from './use-trixta-reaction';

describe('useTrixtaReaction', () => {
  const trixtaReactionCommon = mockTrixtaCommon({ name: 'test_reaction' });
  it('should throw error if no reactionName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaReaction({ roleName: 'test', reactionName: '' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(
      Error('Please provide reactionName parameter.'),
    );
  });

  it('should throw error if no roleName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaReaction({ roleName: '', reactionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide roleName parameter.'));
  });

  it('should return hasRoleAccess false, for roleName test', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaReaction({ roleName: 'test', reactionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(false);
  });

  it('should return hasRoleAccess true, for roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaReaction({
          roleName,
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('should return callbacks clearReactionResponses  and submitTrixtaReaction', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[1];
    const { result } = renderHook(
      () =>
        useTrixtaReaction({
          roleName,
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.clearReactionResponses).toBeDefined();
    expect(result.current.submitTrixtaReaction).toBeDefined();
  });

  it('should return latestResponse,latestInstance undefined for non existent reactionName: test', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[1];
    const { result } = renderHook(
      () =>
        useTrixtaReaction({
          roleName,
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.latestResponse).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.latestInstance).toBeUndefined();
  });

  describe('useTrixtaReaction with requestForEffect true', () => {
    it('should return response, latestInstance existent reactionName: set_queue', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = 'set_queue';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
    });

    it('should return hasResponse true for existent for reactionName: set_queue and roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = 'set_queue';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.hasResponse).toBe(true);
    });

    it('should clear responses, when calling clearReactionResponses for reactionName: set_queue and roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = 'set_queue';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();

      act(() => {
        result.current.clearReactionResponses();
      });

      expect(result.current.latestResponse).toBeUndefined();
      expect(result.current.latestInstance).toBeUndefined();
      expect(result.current.hasResponse).toBe(false);
    });
    it('should return loading true, for reactionName: test_reaction and roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper, store } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = trixtaReactionCommon.name as string;
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeUndefined();
      expect(result.current.latestInstance).toBeUndefined();
      expect(result.current.hasResponse).toBe(false);
      expect(result.current.isInProgress).toBe(true);

      act(() => {
        store.dispatch(
          updateTrixtaReaction({
            role: roleName,
            name: reactionName,
            trixtaReaction: trixtaReactionCommon,
          }),
        );
      });

      expect(result.current.loading).toBe(true);
    });

    it('should return loading false, for reactionName: test_reaction and roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper, store } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = trixtaReactionCommon.name as string;
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeUndefined();
      expect(result.current.latestInstance).toBeUndefined();
      expect(result.current.hasResponse).toBe(false);
      expect(result.current.isInProgress).toBe(true);

      act(() => {
        store.dispatch(
          updateTrixtaReaction({
            role: roleName,
            name: reactionName,
            trixtaReaction: trixtaReactionCommon,
          }),
        );
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        store.dispatch(
          updateTrixtaReactionResponse({
            roleName,
            reactionName,
            reactionResponse: {
              eventName: reactionName,
              initial_data: null,
              ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
              settings: null,
              status: 'ok',
            },
          }),
        );
      });
      expect(result.current.loading).toBe(false);
    });

    it('should return initial_data, for reactionName: test_reaction and roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper, store } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[1];
      const reactionName = trixtaReactionCommon.name as string;
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            requestForEffect: true,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeUndefined();
      expect(result.current.latestInstance).toBeUndefined();
      expect(result.current.hasResponse).toBe(false);
      expect(result.current.isInProgress).toBe(true);

      act(() => {
        store.dispatch(
          updateTrixtaReaction({
            role: roleName,
            name: reactionName,
            trixtaReaction: trixtaReactionCommon,
          }),
        );
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        store.dispatch(
          updateTrixtaReactionResponse({
            roleName,
            reactionName,
            reactionResponse: {
              eventName: reactionName,
              initial_data: { testing: 'test' },
              settings: null,
              status: 'ok',
            },
          }),
        );
      });
      expect(result.current.initialData).toStrictEqual({ testing: 'test' });
    });
  });

  describe('useTrixtaReaction with requestForEffect false', () => {
    it('should return response, latestInstance existent for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
    });

    it('should return hasResponse true for existent for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.hasResponse).toBe(true);
    });

    it('should clear responses, when calling clearReactionResponses for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();

      act(() => {
        result.current.clearReactionResponses();
      });

      expect(result.current.latestResponse).toBeUndefined();
      expect(result.current.latestInstance).toBeUndefined();
      expect(result.current.hasResponse).toBe(false);
    });

    it('should return isInProgress true, when submitTrixtaReaction for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
      expect(result.current.hasResponse).toBe(true);
      expect(result.current.isInProgress).toBe(false);

      act(() => {
        result.current.submitTrixtaReaction({
          data: {},
          ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
        });
      });

      expect(result.current.isInProgress).toBe(true);
    });

    it('should return isInProgress true, when submitTrixtaReaction for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987] and loadingStatusRef: streams', () => {
      const { wrapper } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
            loadingStatusRef: 'streams',
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
      expect(result.current.hasResponse).toBe(true);
      expect(result.current.isInProgress).toBe(false);

      act(() => {
        result.current.submitTrixtaReaction({
          data: {},
          ref: '4a32ed8d-f47d-4e78-921c-6a4aeb996bd3',
        });
      });

      expect(result.current.isInProgress).toBe(true);
    });

    it('should pass success response, when calling onSuccess for actionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper, store } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const reactionName = 'request_guest_stream';
      const ref =
        trixtaState.reactions[
          getReducerKeyName({ name: reactionName, role: roleName })
        ].instances.requestForResponse[0].details.ref;
      const successResponse = {
        email: 'jacques+guest@trixta.com',
        firstName: 'Jacques',
        id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
        lastName: 'Nel',
      };

      let responseData = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onSuccess = (payload: any) => (responseData = payload);
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
            onSuccess: onSuccess,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
      expect(result.current.hasResponse).toBe(true);

      act(() => {
        result.current.submitTrixtaReaction({ data: {}, ref });
      });
      const actionToSubmit = {
        type: SUBMIT_TRIXTA_REACTION_RESPONSE_SUCCESS,
        data: successResponse,
        additionalData: { trixtaMeta: { reactionName, roleName, ref } },
      };
      expect(result.current.isInProgress).toBe(true);
      act(() => {
        store.dispatch(actionToSubmit);
      });
      expect(result.current.isInProgress).toBe(false);
      expect(responseData).toEqual({
        ...successResponse,
        ...actionToSubmit.additionalData,
      });
    });

    it('should pass error response, when calling onError for reactionName: request_guest_stream and roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
      const { wrapper, store } = storeProviderWrapper(trixtaState);
      const roleName = trixtaState.agentDetails[2];
      const errorResponse = {
        message: 'this is an error',
      };
      const reactionName = 'request_guest_stream';
      const ref =
        trixtaState.reactions[
          getReducerKeyName({ name: reactionName, role: roleName })
        ].instances.requestForResponse[0].details.ref;
      let responseData = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onError = (error: any) => (responseData = error);
      const { result } = renderHook(
        () =>
          useTrixtaReaction({
            roleName,
            reactionName,
            onError: onError,
          }),
        {
          wrapper,
        },
      );

      expect(result.current.latestResponse).toBeDefined();
      expect(result.current.latestInstance).toBeDefined();
      expect(result.current.hasResponse).toBe(true);

      act(() => {
        result.current.submitTrixtaReaction({ data: {}, ref });
      });
      const actionToSubmit = {
        type: SUBMIT_TRIXTA_REACTION_RESPONSE_FAILURE,
        error: errorResponse,
        additionalData: { trixtaMeta: { reactionName, roleName, ref } },
      };
      expect(result.current.isInProgress).toBe(true);
      act(() => {
        store.dispatch(actionToSubmit);
      });
      expect(result.current.isInProgress).toBe(false);
      expect(responseData).toEqual({
        ...errorResponse,
        ...actionToSubmit.additionalData,
      });
    });
  });
});
