import { act, renderHook } from '@testing-library/react-hooks';
import { storeProviderWrapper } from '../../../tests/helpers';
import {
  SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
  SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
} from '../../constants/actions';
// eslint-disable-next-line jest/no-mocks-import
import { trixtaState } from '../../reducers/__mocks__/trixtaState';
import { joinTrixtaRole, leaveTrixtaRole } from '../../reduxActions/internal';
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
    const roleName = 'everyone_authed';
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

  it('should return callbacks clearActionResponses and submitTrixtaAction', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
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
    const roleName = 'everyone_authed';
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
    const roleName = 'everyone_authed';
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
    const roleName = 'everyone_authed';
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
    const roleName = 'everyone_authed';
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

  it('should clear responses, with option clearResponsesOnCallback prop for actionName: request_user_info and roleName: everyone_authed', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const actionName = 'request_user_info';
    const trixtaMeta = { roleName, actionName };
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          options: { clearResponsesOnCallback: true },
          actionName,
          onSuccess,
        }),
      {
        wrapper,
      },
    );

    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();

    act(() => {
      result.current.submitTrixtaAction({ data: {} });
    });

    const actionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
      data: {},
      additionalData: { trixtaMeta },
    };
    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch(actionToSubmit);
    });

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
  });

  it('should return isInProgress true, when submitTrixtaAction for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
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

  it('should return isInProgress true, when submitTrixtaAction for actionName: request_user_info_request and roleName: everyone_authed and loadingStatusRef: info', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const actionName = 'request_user_info_request';
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          loadingStatusRef: 'info',
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
    const roleName = 'everyone_authed';
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
    const trixtaMeta = { actionName, roleName };
    const onSuccess = jest.fn(() => ({
      ...successResponse,
      trixtaMeta,
    }));
    const onError = jest.fn();
    const props = {
      roleName,
      actionName,
      onSuccess,
      onError,
    };
    const { result, rerender } = renderHook(() => useTrixtaAction(props), {
      wrapper,
    });

    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);

    act(() => {
      result.current.submitTrixtaAction({ data: {} });
    });

    const actionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
      data: successResponse,
      additionalData: { trixtaMeta },
    };
    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch(actionToSubmit);
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenLastCalledWith({
      ...successResponse,
      trixtaMeta,
    });
    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
    expect(result.current.hasResponse).toBe(true);
    expect(result.current.isInProgress).toBe(false);
    rerender();
    expect(onSuccess).not.toHaveBeenCalledTimes(2);
  });

  it('should call onSuccess once for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const successResponse = {
      email: 'jacques+guest@trixta.com',
      firstName: 'Jacques',
      id: '776f7d0a-8ffb-42c3-ad4b-3c3a87e29baf',
      lastName: 'Nel',
      signUpTimestamp: 1605011883,
      roleName: 'everyone_authed',
      actionName: 'request_user_info_request',
    };

    const onSuccess = jest.fn(() => ({
      ...successResponse,
      trixtaMeta,
    }));
    const onError = jest.fn();
    const actionName = 'request_user_info_request';
    const trixtaMeta = { actionName, roleName, loadingStatusRef: '1' };
    const props = {
      roleName,
      actionName,
      onSuccess,
      onError,
    };
    const { result, rerender } = renderHook(
      () =>
        useTrixtaAction({
          ...props,
          loadingStatusRef: trixtaMeta.loadingStatusRef,
        }),
      {
        wrapper,
      },
    );

    const { result: result_2, rerender: rerender_2 } = renderHook(
      () => useTrixtaAction({ ...props }),
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

    const actionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
      data: successResponse,
      additionalData: { trixtaMeta },
    };
    expect(result.current.isInProgress).toBe(true);
    expect(result_2.current.isInProgress).toBe(false);
    act(() => {
      store.dispatch(actionToSubmit);
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenLastCalledWith({
      ...successResponse,
      trixtaMeta,
    });
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
    expect(result.current.hasResponse).toBe(true);
    expect(result.current.isInProgress).toBe(false);
    rerender();
    rerender_2();
    expect(onSuccess).not.toHaveBeenCalledTimes(2);
  });

  it('should pass error response, when calling onError for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const errorResponse = {
      message: 'this is an error',
    };
    const actionName = 'request_user_info_request';
    const trixtaMeta = { actionName, roleName };
    const onSuccess = jest.fn();
    const onError = jest.fn(() => ({
      ...errorResponse,
      trixtaMeta,
    }));
    const { result } = renderHook(
      () =>
        useTrixtaAction({
          roleName,
          actionName,
          onError,
          onSuccess,
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

    const actionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
      error: errorResponse,
      additionalData: { trixtaMeta },
    };
    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch(actionToSubmit);
    });
    expect(result.current.response).toBeDefined();
    expect(result.current.latestInstance).toBeDefined();
    expect(result.current.hasResponse).toBe(true);
    expect(result.current.isInProgress).toBe(false);
    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenLastCalledWith({
      ...errorResponse,
      trixtaMeta,
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
  it('should autosubmit trixta action on mount, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
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

  it('should autosubmit trixta action on mount with actionParameters, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed and when role access changes', () => {
    const { store, wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    act(() => {
      store.dispatch(leaveTrixtaRole({ roleName }));
    });
    const actionName = 'request_user_info_request';
    const { result, rerender } = renderHook(
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
    act(() => {
      store.dispatch(joinTrixtaRole({ roleName }));
    });
    rerender();
    expect(result.current.response).toBeUndefined();
    expect(result.current.latestInstance).toBeUndefined();
    expect(result.current.hasResponse).toBe(false);
    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch(leaveTrixtaRole({ roleName }));
    });

    rerender();
    act(() => {
      store.dispatch(joinTrixtaRole({ roleName }));
    });
  });

  it('should autosubmit trixta action on mount with actionParameters, when autosubmit true for actionName: request_user_info_request and roleName: everyone_authed', () => {
    const { wrapper } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
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

  it('success type should match props type', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const actionName = 'request_user_info_request';
    const trixtaMeta = { actionName, roleName };
    type successResponseType = {
      email: string;
      firstName: string;
    };
    const successResponse = {
      email: 'jacques+guest@trixta.com',
      firstName: 'Jacques',
    };

    const onSuccess = jest.fn((response) => response);
    const { result } = renderHook(
      () =>
        useTrixtaAction<successResponseType, unknown>({
          roleName,
          actionName,
          onSuccess,
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

    const successActionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_SUCCESS,
      data: successResponse,
      additionalData: { trixtaMeta },
    };
    expect(result.current.isInProgress).toBe(true);
    act(() => {
      store.dispatch(successActionToSubmit);
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenLastCalledWith({
      ...successResponse,
      trixtaMeta,
    });
  });

  it('error type should match props type', () => {
    const { wrapper, store } = storeProviderWrapper(trixtaState);
    const roleName = 'everyone_authed';
    const actionName = 'request_user_info_request';
    const trixtaMeta = { actionName, roleName };
    type errorResponseType = {
      message: string;
      code: string;
    };
    const errorResponse = {
      message: 'Error',
      code: '400',
    };

    const onError = jest.fn((response) => response);
    const { result } = renderHook(
      () =>
        useTrixtaAction<any, errorResponseType>({
          roleName,
          actionName,
          onError,
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

    const errorActionToSubmit = {
      type: SUBMIT_TRIXTA_ACTION_RESPONSE_FAILURE,
      error: errorResponse,
      additionalData: { trixtaMeta },
    };
    act(() => {
      store.dispatch(errorActionToSubmit);
    });
    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenLastCalledWith({
      ...errorResponse,
      trixtaMeta,
    });
    expect(onError).toHaveReturnedWith({
      ...errorResponse,
      trixtaMeta,
    });
  });
});
