
import React from 'react'
import ReactJson, { ReactJsonViewProps } from 'react-json-view'
export const JsonViewer = (data: any) => {
  return (<ReactJson src={data} name={null} displayDataTypes={false} collapsed={2} iconStyle='square' indentWidth={1} displayObjectSize={false} enableClipboard   />)
}


export const JsonEditor = ({src,...rest}:ReactJsonViewProps) => {
  return (<ReactJson src={src} name={null} {...rest}  displayDataTypes={false} iconStyle='square' indentWidth={1} displayObjectSize={false} enableClipboard   />)
}
