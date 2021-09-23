// ! This file has to be outside src folder
import 'github-markdown-css';
import MarkdownToJSX from 'markdown-to-jsx';
import React from 'react';
import { Component } from 'react';

interface MarkdownProps {
  content: string;
}

export default class Markdown extends Component<MarkdownProps> {
  render() {
    const ConvertedContent = this.props.content;
    // const ConvertedContent = emoji.replace_colons(this.props.content);

    // We can remove the `div` wrapper when https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40542 is merged
    return (
      <div className="markdown-body">
        <MarkdownToJSX>{ConvertedContent}</MarkdownToJSX>
      </div>
    );
  }
}
