import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectTrixta } from '../../reduxActions/common';
import { UseTrixtaSpaceProps } from './types';

/**
 * A react hook that will attempt to connect to the passed trixta space and optional params, on mount of component. This hook should be used in the entry point of your react application.
 */
export const useTrixtaSpace = ({
  space,
  params,
}: UseTrixtaSpaceProps): void => {
  const dispatch = useDispatch();
  const connectTrixtaToSpace = useCallback(() => {
    if (!space) return;
    dispatch(connectTrixta({ space, params }));
  }, [dispatch, space, params]);

  useEffect(() => {
    connectTrixtaToSpace();
  }, [connectTrixtaToSpace]);
};
