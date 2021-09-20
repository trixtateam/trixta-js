import { renderHook } from '@testing-library/react-hooks';
import { mockStoreProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useRespondToReactionEffect } from './use-respond-to-reaction-effect';

describe('useRespondToReactionEffect', () => {
  it('should throw error if no reactionName parameter', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useRespondToReactionEffect({ roleName: 'test', reactionName: '' }),
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
      () => useRespondToReactionEffect({ roleName: '', reactionName: 'test' }),
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
        useRespondToReactionEffect({ roleName: 'test', reactionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(false);
  });

  it('should return hasRoleAccess true, for roleName: everyone_authed', () => {
    const { wrapper } = mockStoreProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useRespondToReactionEffect({
          roleName,
          reactionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('Redux store should contain actionToDispatch, for roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987] and reactionName: new_waitroom_status', () => {
    const { wrapper, store } = mockStoreProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[1];
    const reactionName = 'new_waitroom_status';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionToDispatch = (payload: any) => ({
      type: 'TEST_ACTION',
      payload,
    });
    const initialReactionData =
      trixtaState.reactions[
        'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:new_waitroom_status'
      ].instances.requestForEffect[0].details.initial_data;
    const expectedActionPayload = actionToDispatch(initialReactionData);
    const {} = renderHook(
      () =>
        useRespondToReactionEffect({
          actionToDispatch,
          roleName,
          reactionName,
        }),
      {
        wrapper,
      },
    );

    expect(store.getActions()).toEqual([expectedActionPayload]);
  });

  it('Redux store should contain dispatchResponseTo, for roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987] and reactionName: new_waitroom_status', () => {
    const { wrapper, store } = mockStoreProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[1];
    const reactionName = 'new_waitroom_status';
    const dispatchResponseTo = 'TEST_ACTION';
    const initialReactionData =
      trixtaState.reactions[
        'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]:new_waitroom_status'
      ].instances.requestForEffect[0].details.initial_data;
    const expectedActionPayload = {
      type: 'TEST_ACTION',
      payload: initialReactionData,
    };
    const {} = renderHook(
      () =>
        useRespondToReactionEffect({
          dispatchResponseTo,
          roleName,
          reactionName,
        }),
      {
        wrapper,
      },
    );

    expect(store.getActions()).toEqual([expectedActionPayload]);
  });
});
