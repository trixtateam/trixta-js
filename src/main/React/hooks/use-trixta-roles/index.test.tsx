import { renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaRoles } from './use-trixta-roles';

describe('useTrixtaRoles', () => {
  it('should return store agentDetails with role on mount for roleName: test[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const {} = renderHook(
      () =>
        useTrixtaRoles({
          roles: [
            {
              name: 'test[d1be63be-c0e4-4468-982c-5c04714a2987]',
            },
          ],
        }),
      {
        wrapper,
      },
    );

    expect(store.getState().trixta.authorizingStatus).toHaveProperty(
      'test[d1be63be-c0e4-4468-982c-5c04714a2987]',
    );
  });
});
