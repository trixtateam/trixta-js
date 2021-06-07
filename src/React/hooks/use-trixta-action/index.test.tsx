import { renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaAction } from './use-trixta-action';

describe('useTrixtaAction', () => {
  it('should throw error if no actionName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: 'test', actionName: undefined }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide actionName parameter.'));
  });

  it('should throw error if no roleName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: undefined, actionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide roleName parameter.'));
  });

  it('should return hasRoleAccess false', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: 'test', actionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(false);
  });

  it('should return hasRoleAccess true', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasRoleAccess).toBe(true);
  });

  it('should return clearActionResponses and submitTrixtaAction', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.clearActionResponses).toBeDefined();
    expect(result.current.submitTrixtaAction).toBeDefined();
  });

  it('should return response,latestInstance undefined for non existent action', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName: 'test',
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
  });

  it('should return response, latestInstance existent action', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info';
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
  });
});
