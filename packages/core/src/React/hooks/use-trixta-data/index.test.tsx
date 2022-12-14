import { renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaData } from './use-trixta-data';

describe('useTrixtaData', () => {
  it('should return the correct default values', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(() => useTrixtaData(), {
      wrapper,
    });
    expect(result.current.actionNameList).toEqual([]);
    expect(result.current.reactionNameList).toEqual([]);
    expect(result.current.actions).toEqual([]);
    expect(result.current.reactions).toEqual([]);
    expect(result.current.selectedRoleName).toEqual('everyone_anon');
    expect(result.current.selectedActionName).toBeUndefined();
    expect(result.current.selectedReactionName).toBeUndefined();
    expect(result.current.roles).toBeDefined();
  });

  it('should return the action and reaction data for  roleName :guest[d1be63be-c0e4-4468-982c-5c04714a2987]', () => {
    const roleName = 'guest[d1be63be-c0e4-4468-982c-5c04714a2987]';
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(() => useTrixtaData({ roleName }), {
      wrapper,
    });
    expect(result.current.actionNameList.length).toBeGreaterThan(0);
    expect(result.current.reactionNameList.length).toBeGreaterThan(0);
    expect(result.current.actions.length).toBeGreaterThan(0);
    expect(result.current.reactions.length).toBeGreaterThan(0);
    expect(result.current.selectedRoleName).toEqual(roleName);
    expect(result.current.selectedActionName).toBeUndefined();
    expect(result.current.selectedReactionName).toBeUndefined();
    expect(result.current.roles).toBeDefined();
  });
});
