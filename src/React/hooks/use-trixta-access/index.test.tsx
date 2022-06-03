import { renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { mockDefaultTrixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaAccess } from './use-trixta-access';

describe('useTrixtaAccess', () => {
  it('should return the correct default values', () => {
    const { wrapper } = storeProviderWrapper();
    const { result } = renderHook(() => useTrixtaAccess({}), {
      wrapper,
    });

    expect(result.current).toBe(false);
  });

  it('should return true for  roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987] passed as array', () => {
    const role = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: [role],
      }),
    );
    const { result } = renderHook(
      () =>
        useTrixtaAccess({
          roles: [role],
        }),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });
  it('should return true for  roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987] passed as string', () => {
    const role = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: [role],
      }),
    );
    const { result } = renderHook(
      () =>
        useTrixtaAccess({
          roles: role,
        }),
      {
        wrapper,
      },
    );

    expect(result.current).toBe(true);
  });

  it('should return false for  roleName: viewer[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const role = 'viewer[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(
      mockDefaultTrixtaState({
        authorizationStarted: true,
        agentDetails: ['guest[d1be63be-c0e4-4468-982c-5c04714a2987]'],
      }),
      {
        details: { token: 'dummyToken' },
      },
    );
    const { result } = renderHook(() => useTrixtaAccess({ roles: role }), {
      wrapper,
    });

    expect(result.current).toBe(false);
  });
});
