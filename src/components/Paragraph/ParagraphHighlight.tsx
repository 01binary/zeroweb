/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Markdown paragraph highlight
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';

export type ParagraphFragment = {
  tag?: string;
  text: string;
  pos: number;
  length: number;
};

export const ParagraphHighlight: FC<{
  text: string;
  nodes: ParagraphFragment[];
  start: number;
  end: number;
}> = ({ nodes, start, end }) => {
  // Insert <mark> into span that may contain both text and HTML nodes
  const __html = nodes.reduce((html, { tag, text, pos, length }, index) => {
    if (start <= pos) {
      if (end < pos + length) {
        // Highlight ends in this node
        if (start === 0) {
          // Highlight begins at the start of the node
          const highlight = text.substring(0, end - pos + 1);
          const after = text.substring(end - pos + 1);
          return tag
            ? `${html}<${tag}><MARK>${highlight}</MARK>${after}</${tag}>`
            : `${html}<MARK>${highlight}</MARK>${after}`;
        } else {
          // End of highlight splits this node
          const before = text.substring(0, end - pos);
          const after = text.substring(end - pos);
          return tag
            ? `${html}<${tag}>${before}</MARK>${after}</${tag}>`
            : `${html}${before}</MARK>${after}`;
        }
      } else {
        // Node does not interact with the highlight (appears before, after, or completely inside)
        return tag ? `${html}<${tag}>${text}</${tag}>` : `${html}${text}`;
      }
    } else if (start > pos && start < pos + length) {
      // Start of highlight splits this node
      const before = text.substring(0, start - pos);

      if (index + 1 === nodes.length) {
        // Highlight ends in this node
        const highlight = text.substring(start - pos, end - pos + 1);
        const after = text.substring(end - pos + 1);
        return tag
          ? `${html}<${tag}>${before}<MARK>${highlight}</MARK>${after}</${tag}>`
          : `${html}${before}<MARK>${highlight}</MARK>${after}`;
      } else {
        // Highlight ends in the next node
        const after = text.substring(start - pos);
        return tag
          ? `${html}<${tag}>${before}</${tag}><MARK><${tag}>${after}</${tag}>`
          : `${html}${before}<MARK>${after}`;
      }
    }
  }, '');

  return <span id="highlightAnchor" dangerouslySetInnerHTML={{ __html }} />;
};
