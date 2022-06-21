import { ReactElement, ReactNode } from 'react';

// Replace double spaces with markdown paragraphs
export const PARAGRAPH_SEPARATOR = '\r\n\r\n';

// Words to ignore when searching
const IGNORE_WORDS = [
  'a',
  'are',
  'and',
  'it',
  'the',
  'to',
  'from',
  'for',
  'with',
  'of',
  'on',
  'each',
  'using',
  'that',
  'including',
  'expanding',
  'used',
  'utilized',
  'increased',
  'multiple',
  'modify',
  'manipulate',
  'setup',
  'going',
  'our',
  'my',
  'by',
  'as',
  'my',
  'over',
  'onto',
  'new',
  'newest',
];

export const notIgnoreWord = (token: string) => IGNORE_WORDS.indexOf(token) < 0;

export const notDuplicate = (token, index, all) => index === all.indexOf(token);

export const cleanKeyword = (keyword: string) => /\w*/.exec(keyword)[0];

const filterParagraph = ({ type }: ReactElement) => type === 'p';

const mapParagraph = ({
  props: { children },
}: {
  props: Record<string, string>;
}) => children;

export const getMarkdown = (children: ReactNode) =>
  Array.isArray(children)
    ? (children as ReactElement[])
        .filter(filterParagraph)
        .map(mapParagraph)
        .join(PARAGRAPH_SEPARATOR)
    : children.toString();
