import React, { FC } from 'react';

const ExternalLink: FC<{ href: string }> = ({ href, children }) => {
  if (href[0] === '/' && !href.startsWith('/downloads/'))
    return <a href={href}>{children}</a>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default ExternalLink;
