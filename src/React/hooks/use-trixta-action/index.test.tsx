import { act, renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
} from '../../constants/actions';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { useTrixtaAction } from './use-trixta-action';

describe('useTrixtaAction', () => {
  it('should throw error if no actionName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: 'test', actionName: '' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide actionName parameter.'));
  });

  it('should throw error if no roleName parameter', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: '', actionName: 'test' }),
      {
        wrapper,
      },
    );

    expect(result.error).toEqual(Error('Please provide roleName parameter.'));
  });

  it('should return hasRoleAccess false, for roleName test', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const { result } = renderHook(
      () => useTrixtaAction({ roleName: 'test', actionName: 'test' }),
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

  it('should return callbacks clearActionResponses  and submitTrixtaAction', () => {
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

  it('should return response,latestInstance undefined for non existent actionName: test and roleName: everyone_authed', () => {
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
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.latestInstance).toBeUndefined();
  });

  it('should return response, latestInstance existent actionName: request_user_info_request and roleName: everyone_authed', () => {
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

  it('should return hasResponse true for existent actionName: request_user_info_request and roleName: everyone_authed', () => {
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

    expect(result.current.hasResponse).toBe(true);
  });

  it('should clear responses, when calling clearActionResponses for actionName: request_user_info and roleName: everyone_authed', () => {
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

    act(() => {
      result.current.clearActionResponses();
    });

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
  });

  it('should return isInProgress true, when submitTrixtaAction for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
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

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(false);

    act(() => {
      result.current.submitTrixtaAction({ data: {} });
    });

    expect(result.current.isInProgress).toBe(true);
  });

  it('should pass success response, when calling onSuccess for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const successResponse = {
      email: 'jacques+guest@trixta.com',
      firstName: 'Jacques',
      id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
      lastName: 'Nel',
      signUpTimestamp: 1605011883,
      roleName: 'everyone_authed',
      actionName: 'request_user_info_request',
    };
    const actionName = 'request_user_info_request';
    let responseData = {};
    const onSuccess = (payload: any) => (responseData = payload);
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
          onSuccess: onSuccess,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);

    act(() => {
      result.current.submitTrixtaAction({ data: {} });
    });

    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch({
        type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
        data: successResponse,
        additionalData: { actionName, roleName },
      });
    });
    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
    expect(result.current.hasResponse).toBe(true);
    expect(result.current.isInProgress).toBe(false);
    expect(responseData).toEqual(successResponse);
  });

  it('should pass error response, when calling onError for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const errorResponse = {
      message: 'this is an error',
    };
    const actionName = 'request_user_info_request';
    let responseData = {};
    const onError = (error: any) => (responseData = error);
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
          onError: onError,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);

    act(() => {
      result.current.submitTrixtaAction({ data: {} });
    });

    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch({
        type: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
        error: errorResponse,
        additionalData: { actionName, roleName },
      });
    });
    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
    expect(result.current.hasResponse).toBe(true);
    expect(result.current.isInProgress).toBe(false);
    expect(responseData).toEqual(errorResponse);
  });
  it('should autosubmit trixta action on mount, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
          options: { autoSubmit: true },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(true);
  });

  it('should autosubmit trixta action on mount with actionParameters, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = trixtaState.agentDetails[0];
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
          actionParameters: { data: 'test' },
          options: { autoSubmit: true },
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(true);
  });
});
