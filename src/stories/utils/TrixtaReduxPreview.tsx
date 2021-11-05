
import React, { useMemo } from 'react';
import ReactJson from 'react-json-view';
import { useSelector } from "react-redux";
import { makeSelectTrixtaState, TrixtaState } from "../..";

export type TrixtaReduxPreviewProps = {
  section?:string;
  type?: 'reactions'|'actions';
}

export const TrixtaReduxPreview = ({section, type}:TrixtaReduxPreviewProps) => {
  const trixtaStateSelector = useMemo(makeSelectTrixtaState, []);
  const trixtaState = useSelector<{ trixta: TrixtaState }, TrixtaState>((state) =>
  trixtaStateSelector(state),
  );
  let state: any = section && !type ? trixtaState[section] : trixtaState;
  if(type && section){
    state = trixtaState[type][section] ? trixtaState[type][section] : trixtaState;
  }


  return (<ReactJson
    src={state}
    enableClipboard={false}
    name={null}
    displayDataTypes={true}
    collapsed={1}
    iconStyle='square'
    quotesOnKeys={false}
    indentWidth={2}
    displayObjectSize={false}
    />)
}
