import { ReactElement, ReactNode } from 'react';

export const PARAGRAPH_SEPARATOR = '\r\n\r\n';

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
