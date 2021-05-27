export * from './types/actions';
export * from './types/common';
export * from './types/reactions';

// TODO: implement this across all Trixta request responses
export type TrixtaResponse<
  DataT = Record<string, unknown>,
  OtherT = unknown
> = {
  code?: number;
  success?: boolean;
  message?: string;
  data?: DataT;
} & OtherT;
