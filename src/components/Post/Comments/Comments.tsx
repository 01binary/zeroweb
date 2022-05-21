import React, {
  FC,
  useMemo,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { navigate } from 'gatsby';
import { parse } from 'query-string';
import { useLocation } from '@reach/router';
import { FetchResult } from '@apollo/client';
import { useTheme } from 'styled-components';
import Avatar from '../../Avatar';
import MetaLink from '../../../components/MetaLink';
import Login from '../../../components/Login';
import { useBlogData } from '../../../hooks/useBlogData';
import UpVoteIcon from '../../../images/upvote.svg';
import DownVoteIcon from '../../../images/downvote.svg';
import ReactionIcon from '../../../images/reaction.svg';
import MenuIcon from '../../../images/comment-menu.svg';
import SaveIcon from '../../../images/accept.svg';
import CancelIcon from '../../../images/cancel.svg';
import { CommentQuery } from '../../../types/AllCommentsQuery';
import {
  formatAbsDate,
  formatCommentDate,
  formatMarkerDate,
  getCommentId,
} from '../../../utils';
import { Vote } from '../../../types/VoteCommentQuery';
import AddCommentMutation from '../../../types/AddCommentMutation';
import EditCommentMutation from '../../../types/EditCommentMutation';
import ReactCommentMutation from '../../../types/ReactMutation';
import {
  HideTipHandler,
  ShowTipForHandler,
  useTooltip,
} from '../../../hooks/useTooltip';
import { ContextMenu, ContextMenuArrow } from '../../../components/ContextMenu';
import Button from '../../../components/Button';
import CommentVotes from './CommentVotes';
import CommentReactions from './CommentReactions';
import {
  CommentsList,
  CommentsSection,
  CommentsStartDate,
  Comment,
  CommentAvatar,
  MAX_VOTE_SLOTS,
  UpVoteButton,
  DownVoteButton,
  CommentDate,
  CommentContent,
  CommentMetadata,
  CommentActions,
  CommentButton,
  DateMarker,
  CommentMarker,
  DateMarkerLabel,
  MarkerCount,
  CommentsEndDate,
  Me,
  EditCommentForm,
  EditCommentInput,
  EditCommentButtonGroup,
  EditCommentButton,
  AddCommentForm,
  AddCommentRow,
  AddCommentUser,
  AddCommentInput,
  LoadCommentsError,
  EditCommentError,
  PostCommentError,
} from './Comments.styles';
import OptionMenu from './OptionMenu';
import ReactionMenu from './ReactionMenu';
import Alert from '../../../components/Alert';

const DATE_MARKER_THRESHOLD = 100;

type CommentsProps = {
  slug: string;
  postUrl: string;
  absolutePostUrl: string;
  comments: CommentQuery[] | null;
  loading: boolean;
  error: string | null;
  handleVote: (timestamp: string, vote: Vote) => void;
  handleAdd: (comment: AddCommentMutation) => Promise<FetchResult>;
  handleEdit: (comment: EditCommentMutation) => Promise<FetchResult>;
  handleDelete: (timestamp: string) => void;
  handleReact: (comment: ReactCommentMutation) => void;
  showProfileTipFor: ShowTipForHandler;
  hideProfileTip: HideTipHandler;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
  readPosition: number;
  scrollOffset: number;
};

const Comments: FC<CommentsProps> = ({
  slug,
  absolutePostUrl,
  comments,
  loading,
  error: loadCommentsError,
  handleVote,
  handleAdd,
  handleEdit,
  handleDelete,
  handleReact,
  showProfileTipFor,
  hideProfileTip,
  showTipFor,
  hideTip,
  readPosition,
  scrollOffset,
}) => {
  const theme = useTheme();
  const {
    user,
    credentials,
    loginError,
    handleFacebookLogin,
    handleTwitterLogin,
    handleGoogleLogin,
    handleGithubLogin,
    handleLogout,
  } = useBlogData();
  const [commentError, setCommentError] = useState<string | null>();
  const [comment, setComment] = useState<string>('');
  const [commentTiles, setCommentTiles] = useState<boolean[]>([]);
  const commentsMarkerOffsetRef = useRef<number>(0);
  const commentsIndexRef = useRef<number>(0);
  const commentSpansRef = useRef<number[]>([]);
  const commentsRef = useRef<HTMLElement>();
  const optionRef = useRef<HTMLElement>();
  const editRef = useRef<HTMLTextAreaElement>();
  const tipTargetRef = useRef<HTMLElement>();
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [commentMenu, setCommentMenu] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editMarkdown, setEditMarkdown] = useState<string>('');
  const navLocation = useLocation();
  const query = useMemo(() => parse(navLocation.search), [navLocation.search]);

  const {
    hideTip: hideMenu,
    showTipFor: showMenu,
    tipProps: menuProps,
    tipRef: menuRef,
    tooltipText: menuId,
  } = useTooltip({
    placement: 'bottom-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const postComments = useMemo(
    () =>
      comments
        // Post comments are displayed after the post (excludes highlights and reactions)
        ?.filter(({ markdown }) => markdown && markdown.length)
        // Post comments are displayed on a historical timeline
        ?.sort(({ timestamp: timestamp1 }, { timestamp: timestamp2 }) =>
          timestamp1.localeCompare(timestamp2)
        ),
    [comments]
  );

  const maxVotes = useMemo(
    () =>
      postComments?.reduce(
        // Get maximum votes on any comment so we can calculate proportion on available slots
        (acc, { upVotes, downVotes }) =>
          Math.max(acc, upVotes && downVotes ? upVotes + downVotes : 0),
        0
      ) || 0,
    [postComments]
  );

  useLayoutEffect(() => {
    // Calculate % scrolled through comments and which comment is in view
    const AVATAR_TILE_MAX_DIST = 30;

    if (commentsRef.current && postComments && postComments.length > 0) {
      const commentsRect = commentsRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const commentsTop = commentsRect.top - bodyRect.top;

      const offsetPercent =
        Math.max(
          0,
          Math.min(
            commentsRect.height,
            scrollOffset + window.innerHeight * 0.75 - commentsTop
          )
        ) / commentsRect.height;

      const { current, spans, tiles } = postComments.reduce(
        (
          { sum, current, spans, tiles, prevTile, dist },
          { timestamp },
          index,
          items
        ) => {
          const { height } = document
            .getElementById(getCommentId(timestamp))
            .getBoundingClientRect();

          const nextSum = sum + height / commentsRect.height;

          const tile =
            items.length === 1 ||
            (index > 0 && dist < AVATAR_TILE_MAX_DIST && !prevTile);

          return {
            sum: nextSum,
            current: offsetPercent > sum ? index : current,
            spans: [...spans, nextSum],
            tiles: [...tiles, tile],
            prevTile: tile,
            dist: height,
          };
        },
        { sum: 0, current: 0, dist: 0, spans: [], tiles: [], prevTile: false }
      );

      const offsetPixels = commentsRect.height * offsetPercent;

      commentsMarkerOffsetRef.current = Math.max(
        0,
        offsetPixels - theme.unit * 1.5
      );
      commentsIndexRef.current =
        readPosition > 0.99 ? postComments.length - 1 : current;
      commentSpansRef.current = spans;

      setCommentTiles(tiles);
    }
  }, [scrollOffset, postComments, setCommentTiles]);

  useEffect(() => {
    if (comments && comments.length && query.comment) {
      navigate(`#${query.comment}`);
    }
  }, [query, comments]);

  const handleChangeComment = useCallback(
    ({ target: { value } }) => {
      setComment(value);
    },
    [setComment]
  );

  const handlePostComment = useCallback(
    (e) => {
      e.preventDefault();
      if (!comment.length) return;
      handleAdd({
        userName: user.name,
        avatarUrl: user.avatarUrl || '',
        markdown: comment,
      })
        .then(() => {
          setComment('');
          setCommentError(null);
        })
        .catch((e) => setCommentError('Could not post comment'));
    },
    [handleAdd, user, comment]
  );

  const handleReactToComment = useCallback(
    (e) => {
      selectedComment &&
        handleReact({
          userName: user.name,
          avatarUrl: user.avatarUrl,
          parentTimestamp: selectedComment,
          reaction: e.target.id,
        });
    },
    [handleReact, selectedComment]
  );

  const handleEditComment = useCallback(() => {
    setEditingComment(selectedComment);
    setEditMarkdown(
      postComments.find(({ timestamp }) => timestamp === selectedComment)
        ?.markdown || ''
    );
  }, [selectedComment, postComments, setEditingComment, setEditMarkdown]);

  const handleEditCommentChange = useCallback(
    (e) => {
      setEditMarkdown(e.target.value);
    },
    [setEditMarkdown]
  );

  const handleEditCommentSave = useCallback(
    (e) => {
      e.preventDefault();
      if (!editingComment || !editMarkdown.length) return;
      hideTip();
      handleEdit({
        slug,
        timestamp: editingComment,
        markdown: editMarkdown,
      })
        .then(() => {
          setEditingComment(null);
          setEditMarkdown('');
          setCommentError(null);
        })
        .catch(() => setCommentError('Could not save comment'));
    },
    [
      editingComment,
      editMarkdown,
      handleEdit,
      setEditingComment,
      setEditMarkdown,
    ]
  );

  const handleEditCommentCancel = useCallback(
    (e) => {
      e.preventDefault();
      if (!editingComment) return;
      hideTip();
      setEditingComment(null);
      setEditMarkdown('');
    },
    [editingComment, setEditingComment, setEditMarkdown]
  );

  const handleCommentOption = useCallback(
    (e) => {
      switch (e.target.id) {
        case 'editComment':
          handleEditComment();
          break;
        case 'deleteComment':
          handleDelete(selectedComment);
          break;
      }
      setSelectedComment(null);
    },
    [selectedComment, handleEditComment, handleDelete]
  );

  const handleHideCommentMenu = useCallback(() => {
    if (optionRef.current) {
      optionRef.current.classList.remove('comment__option--active');
      optionRef.current = null;
    }

    setCommentMenu(null);
    setSelectedComment(null);
    hideMenu();
  }, [hideMenu, setSelectedComment]);

  const handleShowCommentMenu = (id: string, timestamp: string) => (e) => {
    hideMenu();

    if (commentMenu === id && selectedComment === timestamp) {
      // Toggle comment menu when clicked on same menu, same comment
      handleHideCommentMenu();
    } else {
      // Show comment menu
      setCommentMenu(id);
      setSelectedComment(timestamp);

      optionRef.current = e.target;
      showMenu(id, optionRef);

      e.target.classList.add('comment__option--active');
    }
  };

  const handleShowTip = useCallback(
    (e, text) => {
      tipTargetRef.current = e.target;
      showTipFor(text, tipTargetRef);
    },
    [showTipFor]
  );

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

  const showDateMarker =
    commentsRef.current?.getBoundingClientRect().height > DATE_MARKER_THRESHOLD;
  const showComments = Boolean(postComments && postComments.length);
  const showLoadingComments = Boolean(loading && !comments);
  const showLogin = Boolean(!user && comments);
  const currentUserId = credentials?.userId;
  const showEditError = Boolean(editingComment && commentError);
  const showAddError = Boolean(comment.length && commentError);

  return (
    <CommentsSection
      id="comments"
      isUserLoggedIn={Boolean(user)}
      isLoading={loading}
      hasComments={Boolean(postComments && postComments.length)}
    >
      {postComments && (
        <h2>
          Comments
          {postComments.length ? (
            <span>{` [ ${postComments.length} ]`}</span>
          ) : null}
        </h2>
      )}

      {showLoadingComments && <p>Loading comments...</p>}
      {loadCommentsError && (
        <Alert fullWidth>
          <LoadCommentsError>{loadCommentsError}</LoadCommentsError>
        </Alert>
      )}

      {showLogin && (
        <Login
          {...{
            handleFacebookLogin,
            handleGoogleLogin,
            handleTwitterLogin,
            handleGithubLogin,
            loginError,
            showTipFor,
            hideTip,
          }}
        />
      )}

      {showComments && (
        <>
          <CommentsStartDate>
            {formatMarkerDate(postComments[0].timestamp)}
          </CommentsStartDate>
          <CommentsList ref={commentsRef} isUserLoggedIn={Boolean(user)}>
            {postComments
              .map(({ timestamp, ...rest }) => ({
                id: getCommentId(timestamp),
                timestamp,
                ...rest,
              }))
              .map(
                (
                  {
                    id,
                    timestamp,
                    paragraph,
                    markdown,
                    avatarUrl,
                    userId,
                    userName,
                    upVotes,
                    downVotes,
                    voted,
                  },
                  index
                ) => (
                  <Comment
                    key={`${timestamp}${voted ? 'v' : ''}`}
                    id={id}
                    scrollHighlight={index === commentsIndexRef.current}
                    className={
                      voted || !user || userId === currentUserId
                        ? 'comment-unvotable'
                        : 'comment--votable'
                    }
                    single={postComments.length === 1}
                  >
                    <CommentAvatar
                      index={index}
                      count={postComments.length}
                      tile={commentTiles[index]}
                    >
                      <Avatar avatarUrl={avatarUrl} />
                      <CommentVotes
                        upVotes={upVotes}
                        downVotes={downVotes}
                        maxVotes={maxVotes}
                        maxSlots={MAX_VOTE_SLOTS}
                      />
                      {user && userId !== currentUserId && !voted && (
                        <>
                          <UpVoteButton
                            onClick={() => {
                              hideTip();
                              handleVote(timestamp, 'upVote');
                            }}
                            onMouseOver={(e) => handleShowTip(e, 'up vote')}
                            onMouseOut={hideTip}
                          >
                            <UpVoteIcon />
                          </UpVoteButton>
                          <DownVoteButton
                            onClick={() => {
                              hideTip();
                              handleVote(timestamp, 'downVote');
                            }}
                            onMouseOver={(e) => handleShowTip(e, 'down vote')}
                            onMouseOut={hideTip}
                          >
                            <DownVoteIcon />
                          </DownVoteButton>
                        </>
                      )}
                    </CommentAvatar>
                    {userId === currentUserId ? (
                      <Me>{userName}</Me>
                    ) : (
                      <MetaLink
                        to={`/profile?user=${userId}`}
                        onMouseOver={(e) => {
                          tipTargetRef.current = e.target;
                          showProfileTipFor(timestamp, tipTargetRef);
                        }}
                        onMouseOut={hideProfileTip}
                      >
                        {userName}
                      </MetaLink>
                    )}
                    {paragraph && (
                      <span>
                        {' '}
                        <MetaLink to={`#${paragraph}`}>inline</MetaLink>
                      </span>
                    )}
                    <CommentDate>
                      <MetaLink
                        to={`?comment=${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.navigator.clipboard.writeText(
                            `${absolutePostUrl}?comment=${id}`
                          );
                          handleShowTip(e, 'copied!');
                        }}
                        onMouseOver={(e) =>
                          handleShowTip(e, formatAbsDate(timestamp))
                        }
                        onMouseOut={hideTip}
                      >
                        {' '}
                        {formatCommentDate(timestamp)}
                      </MetaLink>
                    </CommentDate>
                    <CommentContent>
                      {editingComment === timestamp ? (
                        <EditCommentForm onSubmit={(e) => e.preventDefault()}>
                          <EditCommentInput
                            ref={editRef}
                            value={editMarkdown}
                            placeholder="edit your comment"
                            onChange={handleEditCommentChange}
                          />
                          <EditCommentButtonGroup>
                            {showEditError && (
                              <EditCommentError>
                                {commentError}
                              </EditCommentError>
                            )}
                          </EditCommentButtonGroup>
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
                      ) : (
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                      )}
                    </CommentContent>
                    <CommentMetadata>
                      {editingComment !== timestamp && (
                        <CommentReactions
                          timestamp={timestamp}
                          comments={comments}
                        />
                      )}
                      <CommentActions>
                        {userId === currentUserId && !editingComment && (
                          <CommentButton
                            onClick={handleShowCommentMenu(
                              'options',
                              timestamp
                            )}
                            onMouseOver={(e) => handleShowTip(e, 'actions')}
                            onMouseOut={hideTip}
                          >
                            <MenuIcon />
                          </CommentButton>
                        )}
                        {user && userId !== currentUserId && (
                          <CommentButton
                            onClick={handleShowCommentMenu(
                              'reaction',
                              timestamp
                            )}
                            onMouseOver={(e) => handleShowTip(e, 'react')}
                            onMouseOut={hideTip}
                          >
                            <ReactionIcon />
                          </CommentButton>
                        )}
                      </CommentActions>
                    </CommentMetadata>
                  </Comment>
                )
              )}
            <DateMarker
              show={showDateMarker}
              offset={`${commentsMarkerOffsetRef.current}px`}
            >
              <CommentMarker />
              <DateMarkerLabel>
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
      <ContextMenu ref={menuRef} {...menuProps}>
        {menuId === 'reaction' && (
          <ReactionMenu onSelect={handleReactToComment} />
        )}
        {menuId === 'options' && <OptionMenu onSelect={handleCommentOption} />}
        <ContextMenuArrow />
      </ContextMenu>
      {user && comments && (
        <AddCommentForm
          onSubmit={(e) => e.preventDefault()}
          hasComments={Boolean(postComments && postComments.length)}
          tile={commentTiles.length && !commentTiles[postComments.length - 1]}
        >
          <AddCommentRow>
            <AddCommentUser>
              commenting as{' '}
              <MetaLink
                to="/profile"
                onMouseOver={(e) => handleShowTip(e, 'edit your profile')}
                onMouseOut={hideTip}
              >
                {user.name}
              </MetaLink>
            </AddCommentUser>
            <Button onClick={handleLogout}>logout</Button>
          </AddCommentRow>
          <AddCommentRow>
            <AddCommentInput
              value={comment}
              placeholder="leave a comment"
              onChange={handleChangeComment}
            />
          </AddCommentRow>
          {showAddError && <PostCommentError>{commentError}</PostCommentError>}
          <AddCommentRow align="right">
            <Button
              type="submit"
              disabled={loading}
              onClick={handlePostComment}
            >
              comment
            </Button>
          </AddCommentRow>
        </AddCommentForm>
      )}
    </CommentsSection>
  );
};

export default Comments;
