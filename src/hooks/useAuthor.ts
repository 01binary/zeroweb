import { useMemo } from 'react';
import { useTooltip } from './useTooltip';
import authors from '../../authors.json';
import { CommentQuery } from '../types/AllCommentsQuery';

const getPostAuthor = (author: string) => ({
  userName: author,
  userId: authors[author].userId,
  avatarUrl: authors[author].avatarUrl,
});

const getCommentAuthor = (comment?: CommentQuery) =>
  comment && {
    userId: comment.userId,
    userName: comment.userName,
    avatarUrl: comment.avatarUrl,
  };

const getCommentForAuthor = (
  author: string | null,
  comments?: CommentQuery[]
) =>
  author ? comments?.find(({ timestamp }) => timestamp === author) : undefined;

const useAuthor = (postAuthor: string, comments?: CommentQuery[]) => {
  const {
    hideTip: hideProfileTip,
    showTipFor: showProfileTipFor,
    tipProps: profileTipProps,
    tipRef: profileTipRef,
    tooltipText: author,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const profile = useMemo(
    () =>
      author === postAuthor
        ? getPostAuthor(author)
        : getCommentAuthor(getCommentForAuthor(author, comments)),
    [author, postAuthor, comments]
  );

  return {
    profile,
    profileTipRef,
    profileTipProps,
    showProfileTipFor,
    hideProfileTip,
  };
};

export default useAuthor;
