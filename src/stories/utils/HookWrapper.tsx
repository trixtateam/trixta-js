import React from "react";
import { JsonViewer } from "./JsonViewer";

export interface HookWrapperProps<
  HT extends (...args: any) => any,
  PT extends any[] = any[],
> {
  hook: HT;
  props: PT;
  children?: (props: ReturnType<HT>) => React.ReactElement | null;
}

const HookWrapper = <
  HT extends (...args: any) => any,
  PT extends any[] = any[],
>({
  hook,
  props,
  children,
}: HookWrapperProps<HT, PT>): React.ReactElement | null => {
  const response: ReturnType<HT> = hook(...props);
  return (
    <>
      <JsonViewer object={response} />
      <div>{children ? children(response) : null}</div>
    </>
  );
};

export default HookWrapper;
