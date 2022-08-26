import { FetchResult } from '@apollo/client';
import { useCallback } from 'react';
import { User } from '../auth/types';
import AddCommentQuery from '../types/AddCommentQuery';
import AddShareQuery from '../types/AddShareQuery';
import { ShareType } from '../types/AllSharesQuery';
import ReactMutation from '../types/ReactMutation';
import { openUrl } from '../utils';
import { HideTipHandler, useTooltip } from './useTooltip';

type PostReactionsParams = {
  user: User | null;
  title: string;
  description: string;
  absolutePostUrl: string;
  hideTip: HideTipHandler;
  handleReact: (
    params: ReactMutation
  ) => Promise<
    FetchResult<AddCommentQuery, Record<string, any>, Record<string, any>>
  >;
  handleAddShare: (
    shareType: ShareType
  ) => Promise<
    FetchResult<AddShareQuery, Record<string, any>, Record<string, any>>
  >;
};

const usePostReactions = ({
  user,
  title,
  description,
  absolutePostUrl,
  handleReact,
  handleAddShare,
  hideTip,
}: PostReactionsParams) => {
  const {
    hideTip: hideShareMenu,
    showTip: showShareMenu,
    tipProps: shareMenuProps,
    tipRef: shareMenuRef,
    tooltipVisible: shareMenuVisible,
    targetRef: shareMenuTargetRef,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const handleSnap = useCallback(
    () =>
      // React to a post
      handleReact({
        userName: user?.name || '',
        avatarUrl: user?.avatarUrl || '',
        parentTimestamp: null,
        reaction: 'snap',
      }),
    [user, handleReact]
  );

  const handleShare = useCallback(
    (shareType) => {
      // Share a post
      switch (shareType) {
        case 'linkShare':
          handleAddShare('link');
          window.navigator.clipboard.writeText(absolutePostUrl);
          break;
        case 'facebookShare':
          handleAddShare('facebook');
          openUrl('https://www.facebook.com/sharer.php', {
            u: absolutePostUrl,
          });
          break;
        case 'twitterShare':
          handleAddShare('twitter');
          openUrl('https://twitter.com/intent/tweet', {
            text: title,
            url: absolutePostUrl,
          });
          break;
        case 'linkedInShare':
          handleAddShare('linkedIn');
          openUrl('https://www.linkedin.com/shareArticle', {
            title,
            url: absolutePostUrl,
            summary: description,
            mini: true,
          });
          break;
        case 'emailShare':
          handleAddShare('email');
          openUrl('mailto:', {
            subject: title,
            body: absolutePostUrl,
          });
          break;
      }
    },
    [handleAddShare, absolutePostUrl]
  );

  const handleToggleShareMenu = useCallback(() => {
    if (shareMenuVisible) {
      hideShareMenu();
    } else {
      hideTip();
      showShareMenu(null);
    }
  }, [shareMenuVisible, hideShareMenu, hideTip, showShareMenu]);

  const handleHideShareMenu = useCallback(
    () => setTimeout(hideShareMenu, 250),
    [hideShareMenu]
  );

  return {
    handleToggleShareMenu,
    handleHideShareMenu,
    hideShareMenu,
    showShareMenu,
    shareMenuProps,
    shareMenuRef,
    shareMenuVisible,
    shareMenuTargetRef,
    handleSnap,
    handleShare,
  };
};

export default usePostReactions;
