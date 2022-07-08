/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Inline comment thread on paragraph in a post.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, {
  FC,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { ParagraphComment } from '../../hooks/useComments';
import SaveIcon from '../../images/accept.svg';
import CancelIcon from '../../images/cancel.svg';
import { useBlogContext } from '../../hooks/useBlogContext';
import MetaLink from '../MetaLink';
import Login from '../Login';
import { formatCommentDate, getCommentId } from '../../utils';
import { CommentQuery } from '../../types/AllCommentsQuery';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';
import {
  MOBILE,
  MOBILE_NARROW,
  NARROW_SIDE_COMMENTS,
  SIDE_COMMENTS_MAX_WIDTH,
  SIDE_COMMENTS_MIN_WIDTH,
} from '../../constants';

const InlineCommentThread = styled.section<{
  current: boolean;
  alignBottom: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 100%;
  min-width: ${SIDE_COMMENTS_MIN_WIDTH};
  max-width: ${SIDE_COMMENTS_MAX_WIDTH};
  ${(props) => props.current && 'z-index: 1'};
  width: calc(30% - ${(props) => props.theme.spacingHalf});
  background: ${(props) => props.theme.backgroundColor};

  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.foregroundColor};

  p {
    margin-left: 0;
    margin-right: 0;
  }

  @media (max-width: ${NARROW_SIDE_COMMENTS}) {
    ${(props) => props.current === false && 'display: none'};
    ${(props) =>
      props.alignBottom && `top: initial; bottom: -${props.theme.spacingHalf}`};

    border: ${(props) => props.theme.border} solid
      ${(props) => props.theme.borderColor};
    left: initial;
    padding: ${(props) => props.theme.spacing};
    padding-bottom: ${(props) => props.theme.spacingHalf};
    right: 4px;
    width: 40%;
    min-width: ${SIDE_COMMENTS_MIN_WIDTH};
    max-width: ${SIDE_COMMENTS_MAX_WIDTH};
    border-radius: ${(props) => props.theme.spacingSmall};
    box-shadow: 0 0 10px
      ${(props) =>
        props.theme.isDark
          ? `${props.theme.accentDarkShadowColor}66`
          : `${props.theme.dropShadowLightColor}66`};
  }

  @media (max-width: ${MOBILE}) {
    right: ${(props) => props.theme.spacingHalf};
    width: 70%;
    min-width: ${SIDE_COMMENTS_MIN_WIDTH};
    max-width: ${MOBILE_NARROW};
  }
`;

const InlineComment = styled.div`
  font-family: ${(props) => props.theme.smallFont};
  font-weight: ${(props) => props.theme.smallFontWeight};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${(props) => props.theme.foregroundColor};

  border: 1px;
`;

const InlineCommentForm = styled.form`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  width: 100%;
`;

const CurrentUser = styled.section<{ threadHasComments: boolean }>`
  ${(props) =>
    props.threadHasComments && `margin-top: ${props.theme.spacingHalf}`};
`;

const InlineCommentInput = styled.textarea`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: calc(100% - ${(props) => props.theme.spacing});
  min-height: 1.5em;
  max-height: 10em;
  resize: vertical;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }

  padding: ${(props) => props.theme.spacingHalf};
  margin-top: ${(props) => props.theme.spacingHalf};
`;

const InlineCommentFormGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(props) => props.theme.borderThick};
`;

const InlineCommentError = styled(Error)`
  padding: ${(props) => props.theme.spacingQuarter} 0;
`;

const InlineCommentButton = styled.button`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: 32px;
  height: 32px;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }
`;

const InlineCommentHeader = styled.section`
  margin-bottom: 0.25em;
`;

const InlineCommentBody = styled.section`
  p {
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const Me = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

type InlineCommentsProps = {
  className: string;
  postUrl: string;
  absolutePostUrl: string;
  loading: boolean;
  paragraphComments: CommentQuery[];
  showInlineCommentForm: boolean;
  inlineCommentParagraph: ParagraphComment;
  inlineCommentRef: React.MutableRefObject<HTMLTextAreaElement>;
  postContentRef: React.MutableRefObject<HTMLElement>;
  addInlineComment: () => Promise<void>;
  toggleInlineComment: (paragraphHash: string | null) => void;
  setInlineCommentParagraph: (paragraphComment: ParagraphComment) => void;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
  showProfileTipFor: ShowTipForHandler;
  hideProfileTip: HideTipHandler;
};

export const InlineComments: FC<InlineCommentsProps> = ({
  className,
  absolutePostUrl,
  loading,
  paragraphComments,
  showInlineCommentForm,
  inlineCommentParagraph,
  inlineCommentRef,
  postContentRef,
  addInlineComment,
  toggleInlineComment,
  setInlineCommentParagraph,
  showTipFor,
  hideTip,
  showProfileTipFor,
  hideProfileTip,
}) => {
  const {
    user,
    credentials,
    loginError,
    handleFacebookLogin,
    handleTwitterLogin,
    handleGoogleLogin,
    handleGithubLogin,
  } = useBlogContext();

  const [alignBottom, setAlignBottom] = useState<boolean>(false);
  const commentThreadRef = useRef<HTMLElement>(null);
  const tipTargetRef = useRef<HTMLElement>(null);

  const handleAddInlineComment = useCallback(() => {
    addInlineComment();
    hideTip();
  }, [addInlineComment, hideTip]);

  const handleEditInlineComment = useCallback(
    (e) => {
      setInlineCommentParagraph({
        ...inlineCommentParagraph,
        markdown: e.target.value,
      });
    },
    [inlineCommentParagraph, setInlineCommentParagraph]
  );

  const handleCancelInlineComment = useCallback(() => {
    toggleInlineComment(null);
    hideTip();
  }, [toggleInlineComment, hideTip]);

  const handleInlineCommentKeyDown = useCallback(
    (e) => e.key === 'Escape' && toggleInlineComment(null),
    [toggleInlineComment]
  );

  useLayoutEffect(() => {
    if (postContentRef.current && commentThreadRef.current) {
      const {
        bottom: postBottom,
      } = postContentRef.current.getBoundingClientRect();
      const {
        bottom: threadBottom,
      } = commentThreadRef.current.getBoundingClientRect();

      setAlignBottom(threadBottom > postBottom);
    }
  }, [setAlignBottom]);

  return (
    <InlineCommentThread
      ref={commentThreadRef}
      className={className}
      current={showInlineCommentForm}
      alignBottom={alignBottom}
    >
      {paragraphComments?.map(({ userId, userName, timestamp, markdown }) => (
        <InlineComment key={timestamp}>
          <InlineCommentHeader>
            <MetaLink
              to={`?comment=${encodeURIComponent(timestamp)}`}
              onClick={(e) => {
                e.preventDefault();
                window.navigator.clipboard.writeText(
                  `${absolutePostUrl}?comment=${getCommentId(timestamp)}`
                );
                tipTargetRef.current = e.target;
                showTipFor('copied!', tipTargetRef);
              }}
              onMouseOver={(e) => {
                tipTargetRef.current = e.target;
                showTipFor('copy link', tipTargetRef);
              }}
              onMouseOut={hideTip}
            >
              {formatCommentDate(timestamp)}
            </MetaLink>
            {' by '}
            {userId === credentials?.userId ? (
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
          </InlineCommentHeader>
          <InlineCommentBody>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </InlineCommentBody>
        </InlineComment>
      ))}
      {showInlineCommentForm && (
        <InlineCommentForm onSubmit={(e) => e.preventDefault()}>
          {user && (
            <CurrentUser threadHasComments={Boolean(paragraphComments?.length)}>
              commenting as{' '}
              <MetaLink
                to="/profile"
                onMouseOver={(e) => {
                  tipTargetRef.current = e.target;
                  showTipFor('edit your profile', tipTargetRef);
                }}
                onMouseOut={hideTip}
              >
                {user?.name}
              </MetaLink>
              :
            </CurrentUser>
          )}
          {!user && (
            <Login
              inline
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
          <InlineCommentInput
            ref={inlineCommentRef}
            placeholder="comment on this paragraph"
            onChange={handleEditInlineComment}
            onKeyDown={handleInlineCommentKeyDown}
          />
          <InlineCommentFormGroup>
            {inlineCommentParagraph?.error && (
              <InlineCommentError>
                {inlineCommentParagraph?.error}
              </InlineCommentError>
            )}
          </InlineCommentFormGroup>
          <InlineCommentFormGroup>
            {user && (
              <InlineCommentButton
                disabled={loading}
                onClick={handleAddInlineComment}
                onMouseOver={(e) => {
                  tipTargetRef.current = e.target;
                  showTipFor('save', tipTargetRef);
                }}
                onMouseOut={hideTip}
              >
                <SaveIcon />
              </InlineCommentButton>
            )}
            <InlineCommentButton
              onClick={handleCancelInlineComment}
              onMouseOver={(e) => {
                tipTargetRef.current = e.target;
                showTipFor('cancel', tipTargetRef);
              }}
              onMouseOut={hideTip}
            >
              <CancelIcon />
            </InlineCommentButton>
          </InlineCommentFormGroup>
        </InlineCommentForm>
      )}
    </InlineCommentThread>
  );
};
