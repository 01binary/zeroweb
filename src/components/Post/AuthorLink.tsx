import React, { FC, useRef } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';
import MetaLink from '../MetaLink';

type AuthorLinkProps = {
  author: string;
  showProfileTipFor: ShowTipForHandler;
  hideProfileTip: HideTipHandler;
};

const AuthorLink: FC<AuthorLinkProps> = ({
  author,
  showProfileTipFor,
  hideProfileTip,
}) => {
  const authorLinkRef = useRef<HTMLElement>();
  return (
    <MetaLink
      ref={authorLinkRef}
      to="/about"
      onMouseOver={() => showProfileTipFor(author, authorLinkRef)}
      onMouseOut={hideProfileTip}
    >
      {author}
    </MetaLink>
  );
};

export default AuthorLink;
