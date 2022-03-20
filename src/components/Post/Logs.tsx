import React, { FC, useRef } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { MOBILE } from '../../constants';
import LogQuery from '../../types/LogQuery';
import MetaLink from '../MetaLink';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';

const LogsHeading = styled.h2`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  font-weight: ${(props) => props.theme.headingFontWeight};
`;

const LogsSection = styled.section`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.foregroundColor};

  max-width: ${(props) => props.theme.column};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${(props) => props.theme.spacingDouble};

  @media (max-width: ${MOBILE}) {
    max-width: initial;
    margin-right: ${(props) => props.theme.spacingHalf};
    margin-left: 0;
    margin-bottom: 0;
  }
`;

const Log = styled.article`
  display: flex;
  align-items: flex-start;
  justify-content: start;
`;

const LogTitle = styled.h3`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  font-weight: ${(props) => props.theme.headingFontWeight};
  margin-top: 0;
`;

const LogHeading = styled.div`
  width: calc(80%);

  @media (max-width: ${MOBILE}) {
    width: initial;
    flex-grow: 1;
  }
`;

const LogMeta = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${(props) => props.theme.secondaryTextColor};
`;

const LogMetaRow = styled.div``;

const LogMetaValue = styled.span`
  color: ${(props) => props.theme.foregroundColor};
`;

type LogsProps = {
  postUrl: string;
  logs?: LogQuery[];
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const Logs: FC<LogsProps> = ({ postUrl, logs, showTipFor, hideTip }) => {
  const logDateRef = useRef<HTMLElement>(null);
  return logs?.length ? (
    <LogsSection>
      <LogsHeading id="logs">
        Logs
        <span>{` [ ${logs.length} ]`}</span>
      </LogsHeading>

      {logs.map(
        ({
          slug,
          timeToRead,
          frontmatter: { title, description, date, relativeDate },
          fields: { url },
        }) => (
          <Log key={slug}>
            <LogHeading>
              <LogTitle>
                <Link to={url}>{title}</Link>
              </LogTitle>

              <p>{description}</p>
            </LogHeading>
            <LogMeta>
              <LogMetaRow>
                <LogMetaValue>{timeToRead}</LogMetaValue> min to read
              </LogMetaRow>
              <LogMetaRow>
                <MetaLink
                  to={url}
                  onClick={(e) => {
                    e.preventDefault();
                    window.navigator.clipboard.writeText(`${postUrl}${url}`);
                    showTipFor('copied!', logDateRef);
                  }}
                  onMouseOver={(e) => {
                    logDateRef.current = e.target;
                    showTipFor(date, logDateRef);
                  }}
                  onMouseOut={hideTip}
                >
                  {relativeDate}
                </MetaLink>
              </LogMetaRow>
            </LogMeta>
          </Log>
        )
      )}
    </LogsSection>
  ) : null;
};

export default Logs;
