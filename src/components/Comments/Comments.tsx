import React, {
  FC,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import ReactMarkdown from 'react-markdown';
import Avatar from '../Avatar';
import MetaLink from '../MetaLink';
import Login from '../Login';
import Error from '../Error';
import dayjs from 'dayjs';
import { useBlogContext } from '../../hooks/useBlogContext';
import relativeTime from 'dayjs/plugin/relativeTime';
import UpVoteIcon from '../../images/upvote.svg';
import DownVoteIcon from '../../images/downvote.svg';
import ReactionIcon from '../../images/reaction.svg';
import MenuIcon from '../../images/comment-menu.svg';
import SaveIcon from '../../images/accept.svg';
import CancelIcon from '../../images/cancel.svg';
import { CommentQuery } from '../../types/AllCommentsQuery';
import { Vote } from '../../types/VoteCommentQuery';
import AddCommentMutation from '../../types/AddCommentMutation';
import EditCommentMutation from '../../types/EditCommentMutation';
import { useTooltip } from '../../hooks/useTooltip';
import { ContextMenu, ContextMenuArrow } from '../ContextMenu';
import { Tooltip, Arrow } from '../Tooltip';
import ReactCommentMutation from '../../types/ReactMutation';
import {
  CommentsList,
  CommentsSection,
  CommentsStartDate,
  Comment,
  CommentAvatar,
  MAX_VOTE_SLOTS,
  UpVoteButton,
  DownVoteButton,
  Me,
  CommentDate,
  CommentContent,
  CommentMetadata,
  CommentActions,
  CommentButton,
  DateMarker,
  CommentMarker,
  DateMarkerLabel,
  MarkerCount,
  CommentsEndDate
} from './Comments.styles';
import {
  EditCommentButton,
  EditCommentButtonGroup,
  EditCommentForm, EditCommentInput
} from './EditComment.styles';
import { AddCommentAvatar, AddCommentForm, AddCommentInput, AddCommentRow, AddCommentUser } from './AddComment.styles';
import CommentVotes from './CommentVotes';
import CommentReactions from './CommentReactions';
import { ReactionMenu, OptionMenu } from './CommentMenus';
import PrimaryButton from '../PrimaryButton';

dayjs.extend(relativeTime);

const formatCommentDate = (timestamp: string): string => (
  dayjs(timestamp).fromNow()
);

const formatMarkerDate = (timestamp: string): string => (
  dayjs(timestamp).format('MMM YYYY')
);

type CommentsProps = {
  slug: string;
  comments: CommentQuery[] | null;
  loading: boolean;
  error: string | null;
  loginError: string | null;
  commentError: string | null;
  handleVote: (timestamp: string, vote: Vote) => void;
  handleAdd: (comment: AddCommentMutation) => Promise<void>;
  handleEdit: (comment: EditCommentMutation) => Promise<void>;
  handleDelete: (timestamp: string) => void;
  handleReact: (comment: ReactCommentMutation) => void;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  handleTwitterLogin: () => void;
  handleLogout: () => void;
  readPosition: number;
  scrollOffset: number;
};

const Comments: FC<CommentsProps> = ({
  slug,
  comments,
  loading,
  error,
  loginError,
  commentError,
  handleVote,
  handleAdd,
  handleEdit,
  handleDelete,
  handleReact,
  handleFacebookLogin,
  handleGoogleLogin,
  handleTwitterLogin,
  handleLogout,
  readPosition,
  scrollOffset,
}) => {
  const { user } = useBlogContext();
  const [ comment, setComment ] = useState<string>('');
  const commentsMarkerOffsetRef = useRef<number>(0);
  const commentsIndexRef = useRef<number>(0);
  const commentSpansRef = useRef<number[]>([]);
  const commentsRef = useRef<HTMLElement>();
  const markerRef = useRef<HTMLElement>();
  const optionRef = useRef<HTMLElement>();
  const editRef = useRef<HTMLTextAreaElement>();
  const tipTargetRef = useRef<HTMLElement>();
  const [ selectedComment, setSelectedComment ] = useState<string | null>(null);
  const [ editingComment, setEditingComment ] = useState<string | null>(null);
  const [ editMarkdown, setEditMarkdown ] = useState<string>('');
  const {
    hideTip: hideMenu,
    showTipFor: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    tooltipText: menuId,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6
  });
  const {
    hideTip,
    showTipFor,
    tipProps,
    tipRef,
    tooltipText,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6
  });

  const postComments = comments
    // Post comments are displayed after the post (excludes highlights and reactions)
    ?.filter(({ markdown }) => markdown && markdown.length)
    // Post comments are displayed on a historical timeline
    ?.sort(({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => (
      timestamp1.localeCompare(timestamp2)
    ));

  const maxVotes = postComments?.reduce(
    // Get maximum votes on any comment so we can calculate proportion on available slots
    (acc, { upVotes, downVotes }) => Math.max(acc, upVotes && downVotes ? upVotes + downVotes : 0), 0
  ) || 0;

  useLayoutEffect(() => {
    // Calculate % scrolled through comments and which comment is in view
    if (commentsRef.current && postComments && postComments.length > 0) {
      const commentsRect = commentsRef.current.getBoundingClientRect();
      const { height: markerHeight } = markerRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const commentsTop = commentsRect.top - bodyRect.top;
      const spans = [];

      const offsetPercent = Math.max(0, Math.min(commentsRect.height,
        (scrollOffset + window.innerHeight * 0.75 - commentsTop)
      )) / commentsRect.height;

      const { current } = postComments.reduce(
        ({ sum, current }, { timestamp }, index) => {
          const { height } = document
            .getElementById(`comment-${timestamp}`)
            .getBoundingClientRect();
          const nextSum = sum + height / commentsRect.height;
          spans.push(nextSum);
          return {
            sum: nextSum,
            current: offsetPercent > sum ? index : current,
          }
        },
        { sum: 0, current: 0 });

      const offsetPixels = commentsRect.height * offsetPercent;

      commentsMarkerOffsetRef.current = offsetPixels > markerHeight
        ? offsetPixels - markerHeight
        : offsetPixels;
      commentsIndexRef.current = readPosition > .99 ? postComments.length - 1 : current;
      commentSpansRef.current = spans;
    }
  }, [scrollOffset, postComments]);

  const handleChangeComment = useCallback(({ target: { value }}) => {
    setComment(value);
  }, [setComment]);

  const handlePostComment = useCallback((e) => {
    e.preventDefault();
    if (!comment.length) return;
    handleAdd({
      userName: user.name,
      avatarUrl: user.avatarUrl || '',
      markdown: comment
    }).then(() => setComment(''));
  }, [handleAdd, user, comment]);

  const handleHideCommentMenu = useCallback((e) => {
    const target = e.target;
    setTimeout(() => {
      target.classList.remove('comment__option--active');
      optionRef.current = null;
      setSelectedComment(null);
      hideMenu();
    }, 250);
  }, [hideMenu, setSelectedComment]);

  const handleShowCommentMenu = (id: string, timestamp: string) => (e) => {
    if (e.target.classList.contains('comment__option--active')) {
      handleHideCommentMenu(e);
    } else {
      e.target.classList.add('comment__option--active');
      optionRef.current = e.target;
      setSelectedComment(timestamp);
      showMenu(id, optionRef);
    }
  };

  const handleReactToComment = useCallback((e) => {
    handleReact({
      userName: user.name,
      avatarUrl: user.avatarUrl,
      parentTimestamp: selectedComment,
      reaction: e.target.id
    });
  }, [handleReact]);

  const handleEditComment = useCallback(() => {
    setEditingComment(selectedComment);
    setEditMarkdown(postComments.find(
      ({ timestamp }) => timestamp === selectedComment
    )?.markdown || '');
  }, [selectedComment, postComments, setEditingComment, setEditMarkdown]);

  const handleEditCommentChange = useCallback((e) => {
    setEditMarkdown(e.target.value);
  }, [setEditMarkdown]);

  const handleEditCommentSave = useCallback((e) => {
    e.preventDefault();
    if (!editingComment || !editMarkdown.length) return;
    hideTip();
    handleEdit({
      slug,
      timestamp: editingComment,
      markdown: editMarkdown
    }).then(() => {
      setEditingComment(null);
      setEditMarkdown('');
    }).catch((e) => {
      console.error(e);
    });
  }, [editingComment, editMarkdown, handleEdit, setEditingComment, setEditMarkdown]);

  const handleEditCommentCancel = useCallback((e) => {
    e.preventDefault();
    if (!editingComment) return;
    hideTip();
    setEditingComment(null);
    setEditMarkdown('');
  }, [editingComment, setEditingComment, setEditMarkdown]);

  const handleCommentOption = useCallback((e) => {
    switch (e.target.id) {
      case 'editComment':
        handleEditComment();
        break;
      case 'deleteComment':
        handleDelete(selectedComment);
        break;
    }
    setSelectedComment(null);
  }, [selectedComment, handleEditComment, handleDelete]);

  const handleShowTip = useCallback((e, text) => {
    tipTargetRef.current = e.target;
    showTipFor(text, tipTargetRef);
  }, [showTipFor]);

  useEffect(() => {
    if (editingComment && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingComment]);

  useEffect(() => {
    document.body.addEventListener('click', hideMenu);
    return () => {
      document.body.removeEventListener('click', hideMenu);
    };
  });

  const showComments = Boolean(postComments && postComments.length);
  const showLoadingComments = Boolean(loading && !comments);
  const showLogin = Boolean(!user && comments);

  return (
    <CommentsSection
      isUserLoggedIn={Boolean(user)}
      isLoading={loading}
      hasComments={Boolean(postComments && postComments.length)}
    >
      {postComments && (
        <h2>
          Comments
          {postComments.length
            ? <span>&nbsp;[&nbsp;{postComments.length}&nbsp;]</span>
            : null
          }
        </h2>
      )}

      {showLoadingComments && <p>Loading comments...</p>}
      {error && <Error>{error}</Error>}

      {showLogin &&
        <Login
          handleFacebookLogin={handleFacebookLogin}
          handleGoogleLogin={handleGoogleLogin}
          handleTwitterLogin={handleTwitterLogin}
          loginError={loginError}
        />
      }

      {showComments && (
        <>
          <CommentsStartDate>
            {formatMarkerDate(postComments[0].timestamp)}
          </CommentsStartDate>
          <CommentsList ref={commentsRef} isUserLoggedIn={Boolean(user)}>
            {postComments
              .map(({
                timestamp,
                markdown,
                avatarUrl,
                userId,
                userName,
                upVotes,
                downVotes,
                voted,
                me,
              }, index) => (
                <Comment
                  key={`${timestamp}${voted ? 'v' : ''}`}
                  id={`comment-${timestamp}`}
                  scrollHighlight={index === commentsIndexRef.current}
                  className={(voted || me || !user) ? 'comment-unvotable' : 'comment--votable'}
                >
                  <CommentAvatar
                    index={index}
                    distance={index
                      ? commentSpansRef.current[index] - commentSpansRef.current[index - 1]
                      : 0
                    }
                  >
                    <Avatar avatarUrl={avatarUrl} />
                    <CommentVotes
                      upVotes={upVotes}
                      downVotes={downVotes}
                      maxVotes={maxVotes}
                      maxSlots={MAX_VOTE_SLOTS}
                    />
                    {(user && !me && !voted) &&
                      <>
                        <UpVoteButton
                          onClick={() => handleVote(timestamp, 'upVote')}
                          onMouseOver={(e) => handleShowTip(e, 'up vote')}
                          onMouseOut={hideTip}
                        >
                          <UpVoteIcon />
                        </UpVoteButton>
                        <DownVoteButton
                          onClick={() => handleVote(timestamp, 'downVote')}
                          onMouseOver={(e) => handleShowTip(e, 'down vote')}
                          onMouseOut={hideTip}
                        >
                          <DownVoteIcon />
                        </DownVoteButton>
                      </>
                    }
                  </CommentAvatar>
                  {me
                    ? <Me>{userName}</Me>
                    : <MetaLink to={`/profile/${userId}`}>{userName}</MetaLink>
                  }
                  <CommentDate>
                    <MetaLink
                      to={`?comment=${encodeURIComponent(timestamp)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          `${window.location.href}?comment=${encodeURIComponent(timestamp)}`
                        );
                        handleShowTip(e, 'copied!');
                      }}
                      onMouseOver={(e) => handleShowTip(e, 'copy link')}
                      onMouseOut={hideTip}
                    >
                      {' '}
                      {formatCommentDate(timestamp)}
                    </MetaLink>
                  </CommentDate>
                  <CommentContent>
                    {editingComment === timestamp
                      ? (
                        <EditCommentForm onSubmit={(e) => e.preventDefault()}>
                          <EditCommentInput
                            ref={editRef}
                            value={editMarkdown}
                            placeholder="edit your comment"
                            onChange={handleEditCommentChange}
                          />
                          <Error>
                            {commentError}
                          </Error>
                          <EditCommentButtonGroup>
                            <EditCommentButton
                              disabled={loading}
                              onClick={handleEditCommentSave}
                              onMouseOver={(e) => handleShowTip(e, 'save')}
                              onMouseOut={hideTip}
                            >
                              <SaveIcon />
                            </EditCommentButton>
                            <EditCommentButton
                              disabled={loading}
                              onClick={handleEditCommentCancel}
                              onMouseOver={(e) => handleShowTip(e, 'cancel')}
                              onMouseOut={hideTip}
                            >
                              <CancelIcon />
                            </EditCommentButton>
                          </EditCommentButtonGroup>
                        </EditCommentForm>
                      )
                      : <ReactMarkdown>{markdown}</ReactMarkdown>
                    }
                  </CommentContent>
                  <CommentMetadata>
                    <CommentReactions timestamp={timestamp} comments={comments} />
                    <CommentActions>
                      {(me && !editingComment) &&
                        <CommentButton
                          onClick={handleShowCommentMenu('options', timestamp)}
                          onBlur={handleHideCommentMenu}
                          onMouseOver={(e) => handleShowTip(e, 'actions')}
                          onMouseOut={hideTip}
                        >
                          <MenuIcon />
                        </CommentButton>
                      }
                      {(user && !me) &&
                        <CommentButton
                          onClick={handleShowCommentMenu('reaction', timestamp)}
                          onBlur={handleHideCommentMenu}
                          onMouseOver={(e) => handleShowTip(e, 'react')}
                          onMouseOut={hideTip}
                        >
                          <ReactionIcon />
                        </CommentButton>
                      }
                    </CommentActions>
                  </CommentMetadata>
                </Comment>
              ))}
              <DateMarker offset={`${commentsMarkerOffsetRef.current}px`}>
                <CommentMarker />
                <DateMarkerLabel ref={markerRef}>
                  <MarkerCount>
                    {commentsIndexRef.current + 1}
                    {' / '}
                    {postComments.length}
                  </MarkerCount>
                  {formatMarkerDate(
                    postComments[commentsIndexRef.current]?.timestamp
                  )}
                </DateMarkerLabel>
              </DateMarker>
          </CommentsList>
          <CommentsEndDate>
            {formatMarkerDate(postComments[postComments.length - 1].timestamp)}
          </CommentsEndDate>
        </>
      )}
      <ContextMenu
        ref={menuRef}
        className={selectedComment ? 'comment-menu--open' : 'comment-menu--closed'}
        {...menuProps}
      >
        {menuId === 'reaction' &&
          <ReactionMenu onSelect={handleReactToComment} />
        }
        {menuId === 'options' &&
          <OptionMenu onSelect={handleCommentOption} />
        }
        <ContextMenuArrow />
      </ContextMenu>
      <Tooltip
        ref={tipRef}
        {...tipProps}
      >
        {tooltipText}
        <Arrow />
      </Tooltip>
      {(user && comments) &&
        <AddCommentForm
          onSubmit={(e) => e.preventDefault()}
          hasComments={Boolean(postComments && postComments.length)}
        >
          {commentError &&
            <AddCommentRow>
              <Error>{commentError}</Error>
            </AddCommentRow>
          }
          <AddCommentRow>
            <AddCommentAvatar>
              <Avatar avatarUrl={user.avatarUrl} />
            </AddCommentAvatar>
            <AddCommentUser>
              commenting as <MetaLink to="/profile">{user.name}</MetaLink>
            </AddCommentUser>
            <PrimaryButton onClick={handleLogout}>logout</PrimaryButton>
          </AddCommentRow>
          <AddCommentRow>
            <AddCommentInput
              value={comment}
              placeholder="leave a comment"
              onChange={handleChangeComment}
            />
          </AddCommentRow>
          <AddCommentRow align="right">
            <PrimaryButton
              type="submit"
              disabled={loading}
              onClick={handlePostComment}
            >
              comment
            </PrimaryButton>
          </AddCommentRow>
        </AddCommentForm>
      }
    </CommentsSection>
  );
};

export default Comments;
