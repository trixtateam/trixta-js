import { renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import {
  mockAuthorizingStatus,
  mockDefaultTrixtaState,
} from '../../reducers/__mocks__/trixtaState';
import { useTrixtaAuth } from './use-trixta-auth';

describe('useTrixtaAuth', () => {
  it('should return the correct default values', () => {
    const { wrapper } = storeProviderWrapper();
    const { result } = renderHook(() => useTrixtaAuth({}), {
      wrapper,
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.hasRoles).toBe(false);
    expect(result.current.isAuthorizing).toBe(true);
  });

  it('should return isAuthorizing false', () => {
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({ authorizationStarted: true }),
    );
    const { result } = renderHook(() => useTrixtaAuth({}), {
      wrapper,
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.hasRoles).toBe(false);
    expect(result.current.isAuthorizing).toBe(false);
  });

  it('should return isAuthorizing true for roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        authorizingStatus: mockAuthorizingStatus,
      }),
    );
    const { result } = renderHook(
      () =>
        useTrixtaAuth({
          roles: ['guest[d1be63be-c0e4-4468-982c-5c04714a2987]'],
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.hasRoles).toBe(false);
    expect(result.current.isAuthorizing).toBe(true);
  });

  it('should return hasAccess true for  roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987] passed as array', () => {
    const role = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: [role],
      }),
    );
    const { result } = renderHook(
      () =>
        useTrixtaAuth({
          roles: [role],
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.hasRoles).toBe(true);
    expect(result.current.isAuthorizing).toBe(false);
  });
  it('should return hasAccess true for  roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987] passed as string', () => {
    const role = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: [role],
      }),
    );
    const { result } = renderHook(
      () =>
        useTrixtaAuth({
          roles: role,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBeUndefined();
    expect(result.current.hasRoles).toBe(true);
    expect(result.current.isAuthorizing).toBe(false);
  });

  it('should return isAuthenticated true', () => {
    const { wrapper } = storeProviderWrapper(mockDefaultTrixtaState({}), {
      details: { token: 'dummyToken' },
    });
    const { result } = renderHook(() => useTrixtaAuth({}), {
      wrapper,
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.hasRoles).toBe(false);
    expect(result.current.isAuthorizing).toBe(true);
  });

  it('should return isAuthenticated false', () => {
    const { wrapper } = storeProviderWrapper(mockDefaultTrixtaState({}), {
      details: { id: 'userId' },
    });
    const { result } = renderHook(() => useTrixtaAuth({}), {
      wrapper,
    });

    expect(result.current.hasAccess).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.hasRoles).toBe(false);
    expect(result.current.isAuthorizing).toBe(true);
  });

  it('should return hasAccess true for  roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const role = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: [role],
      }),
      {
        details: { token: 'dummyToken' },
      },
    );
    const { result } = renderHook(() => useTrixtaAuth({ roles: role }), {
      wrapper,
    });

    expect(result.current.hasAccess).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.hasRoles).toBe(true);
    expect(result.current.isAuthorizing).toBe(false);
  });
});
