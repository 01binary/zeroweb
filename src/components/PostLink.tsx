import React, { FC } from 'react';

const PostLink: FC<{ href: string }> = ({ href, children, ...rest }) => {
  // Keep relative links
  if (href[0] === '/' && !href.startsWith('/downloads/') && !href.startsWith('/static/'))
    return <a href={href} {...rest}>{children}</a>;

  // Rewrite external links
  return (
    <a href={href} {...rest} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default PostLink;
