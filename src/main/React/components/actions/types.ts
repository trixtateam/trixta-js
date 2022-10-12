/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
  TrixtaInstanceResponse,
} from '../../types';
import { TrixtaInstance } from '../../types/common';
export interface TrixtaActionComponentArgs<
  TFormData = any,
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * Name of Trixta action
   */
  actionName: string;
  /**
   * Name of Trixta role
   */
  roleName: string;
  /**
   * Override the initial data for Trixta Action
   */
  initialData?: unknown;
  instances: TrixtaInstance<unknown, unknown>[];
  submit: TrixtaDispatch<TFormData>;
  common: TrixtaCommon;
  isInProgress: boolean;
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export interface TrixtaActionResponseComponentArgs<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  response?: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}
