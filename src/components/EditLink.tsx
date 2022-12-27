import React, { FC } from 'react';
import styled from 'styled-components';
import { MOBILE } from '../constants';
import { getGitHubEditUrl } from '../utils';
import EditIcon from '../images/markdown.svg';

const StyledEditIcon = styled(EditIcon)`
  margin-top: calc(${(props) => props.theme.border} / 2);
  margin-right: calc(
    ${(props) => props.theme.spacingQuarter} - ${(props) => props.theme.border}
  );
  margin-left: calc(
    0px - ${(props) => props.theme.spacing} +
      ${(props) => props.theme.borderThick} + ${(props) => props.theme.border}
  );

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

const EditLinkWrapper = styled.a`
  display: flex;
  align-items: center;
  text-transform: lowercase;
`;

type EditLinkProps = {
  path: string;
  className?: string;
};

const EditLink: FC<EditLinkProps> = ({ path, className }) => (
  <EditLinkWrapper
    className={className}
    href={getGitHubEditUrl(path)}
    target="__blank"
  >
    <StyledEditIcon /> Edit on GitHub
  </EditLinkWrapper>
);

export default EditLink;
