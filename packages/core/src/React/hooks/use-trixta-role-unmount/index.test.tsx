import { act, renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaRoleUnmount } from './use-trixta-role-unmount';

describe('useTrixtaRoleUnmount', () => {
  it('should return store agentDetails with role on mount for roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const {} = renderHook(
      () =>
        useTrixtaRoleUnmount({
          roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        }),
      {
        wrapper,
      },
    );

    expect(store.getState().trixta.agentDetails).toHaveProperty(
      'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
    );
  });

  it('should return store agentDetails with no role on unmount for roleName: guest[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const { unmount } = renderHook(
      () =>
        useTrixtaRoleUnmount({
          roleName: 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
        }),
      {
        wrapper,
      },
    );

    act(() => {
      unmount();
    });

    expect(store.getState().trixta.agentDetails).not.toHaveProperty(
      'guest[d1be63be-c0e4-4468-982c-5c04714a2987]',
    );
  });
});
