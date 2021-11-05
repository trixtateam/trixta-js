
import React from 'react'
import ReactJson, { ReactJsonViewProps } from 'react-json-view'
export const JsonViewer = (data: any) => {
  return (<ReactJson src={data} name={null} quotesOnKeys={false} displayDataTypes={false} collapsed={2} iconStyle='square' indentWidth={1} displayObjectSize={false} enableClipboard   />)
}


export const JsonEditor = ({src,...rest}:ReactJsonViewProps) => {
  return (<ReactJson src={src} name={null} {...rest} quotesOnKeys={false} displayDataTypes={false} iconStyle='square' indentWidth={1} displayObjectSize={false} enableClipboard   />)
}
