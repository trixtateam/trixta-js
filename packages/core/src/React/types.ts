export * from './types/actions';
export * from './types/common';
export * from './types/reactions';
export * from './reduxActions/types';
export * from './TrixtaDebugger/types';
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

export type TrixtaChannelDetails = {
  /**
   * The Trixta role name for the channel without group
   */
  role: string;
  /**
   * The Trixta group for the channel if any . eg [234245324324]
   */
  group?: string;
  /**
   * The Trixta channelTopic without the space: prefix.
   */
  roleNameWithGroup: string;
  /**
   * The full channelTopic
   */
  channelTopic: string;
};
