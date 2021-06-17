import { act, renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaActionReaction } from './use-trixta-action-reaction';

describe('useTrixtaActionReaction', () => {
  it('should throw error if no actionName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: { actionName: '', roleName },
          reactionProps: { reactionName: '' },
        }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide actionName parameter.'));
  });

  it('should throw error if no reactionName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: { actionName: 'test', roleName },
          reactionProps: { reactionName: '' },
        }),
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
      () =>
        useTrixtaActionReaction({
          actionProps: { actionName: 'test', roleName: '' },
          reactionProps: { reactionName: '' },
        }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide roleName parameter.'));
  });

  it('should return hasRoleAccess false, for roleName: test', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: { roleName: 'test', actionName: 'test' },
          reactionProps: { reactionName: 'test' },
        }),
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
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName: 'test',
          },
          reactionProps: { roleName, reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('should return hasRoleAccess true,even if not specifying reactionProps roleName for roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName: 'test',
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('should return callbacks clearActionResponses,clearReactionResponses,submitTrixtaReactionResponse,submitTrixtaActionResponse', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName: 'test',
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.clearActionResponses).toBeDefined();
    expect(result.current.clearReactionResponses).toBeDefined();
    expect(result.current.submitTrixtaActionResponse).toBeDefined();
    expect(result.current.submitTrixtaReactionResponse).toBeDefined();
  });

  it('should return actionResponse undefined for non existent actionName: test and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName: 'test',
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeUndefined();
  });

  it('should return actionResponse existent actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName,
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeDefined();
  });

  it('should return hasResponse, hasActionResponse true for existent actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName,
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasResponse).toBe(true);
    expect(result.current.hasActionResponse).toBe(true);
  });

  it('should clear responses, when calling clearActionResponses for actionName: request_user_info and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName,
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeDefined();

    act(() => {
      result.current.clearActionResponses();
    });

    expect(result.current.actionResponse).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.hasActionResponse).toBe(false);
  });

  it('should return isInProgress true, when submitTrixtaActionResponse for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          actionProps: {
            roleName,
            actionName,
          },
          reactionProps: { reactionName: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(false);

    act(() => {
      result.current.submitTrixtaActionResponse({ data: {} });
    });

    expect(result.current.isInProgress).toBe(true);
  });

  it('should autosubmit trixta action on mount, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          autoSubmit: true,
          reactionProps: { reactionName: 'test' },
          actionProps: {
            roleName,
            actionName,
          },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(true);
  });

  it('should autosubmit trixta action on mount with actionParameters, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaActionReaction({
          autoSubmit: true,
          reactionProps: { reactionName: 'test' },
          actionProps: {
            roleName,
            actionName,
          },
          actionParameters: { data: 'test' },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.actionResponse).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(true);
  });
});
