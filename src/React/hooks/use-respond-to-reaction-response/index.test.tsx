import { act, renderHook } from '@testing-library/react-hooks';
import { mockStoreProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { submitTrixtaReactionResponse } from '../../reduxActions';
import { TrixtaReactionInstance } from '../../types';
import { useRespondToReactionResponse } from './use-respond-to-reaction-response';

describe('useRespondToReactionResponse', () => {
  it('should throw error if no reactionName parameter', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const { result } = renderHook(
      () =>
        useRespondToReactionResponse({ roleName: 'test', reactionName: '' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(
      Error('Please provide reactionName parameter.'),
    );
  });

  it('should throw error if no roleName parameter', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const { result } = renderHook(
      () =>
        useRespondToReactionResponse({ roleName: '', reactionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide roleName parameter.'));
  });

  it('should return hasRoleAccess false, for roleName test', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const { result } = renderHook(
      () =>
        useRespondToReactionResponse({
          roleName: 'test',
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(false);
  });

  it('should return hasRoleAccess true, for roleName: everyone_authed', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const { result } = renderHook(
      () =>
        useRespondToReactionResponse({
          roleName,
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('Redux store should contain SubmitTrixtaReactionResponseAction, for roleName: host[d1be63be-c0e4-4468-982c-5c04714a2987] and reactionName: request_guest_stream', () => {
    const { wrapper, store } = mockStoreProviderWrapper(trixtaState);
    const roleName = 'host[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const reactionName = 'request_guest_stream';
    const ref =
      trixtaState.reactions[
        'host[d1be63be-c0e4-4468-982c-5c04714a2987]:request_guest_stream'
      ].instances.requestForResponse[0].details.ref;
    const expectedActionPayload = submitTrixtaReactionResponse({
      formData: {},
      ref,
      roleName,
      reactionName,
    });
    const { result } = renderHook(
      () =>
        useRespondToReactionResponse({
          roleName,
          reactionName,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.latestInstance).toBeDefined();

    act(() => {
      result.current.respondToReaction({
        data: {},
        instance: result.current.latestInstance as TrixtaReactionInstance,
      });
    });

    expect(store.getActions()).toEqual([expectedActionPayload]);
  });
});
