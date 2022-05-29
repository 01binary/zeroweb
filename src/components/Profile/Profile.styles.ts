import styled from 'styled-components';
import LocationIcon from '../../images/location.svg';
import BlurbIcon from '../../images/blurb.svg';
import Frame from '../../images/frame.svg';
import { MOBILE, MOBILE_MIN } from '../../constants';
import Error from '../Error';
import Avatar from '../Avatar';

export const ProfilePage = styled.main`
  margin-bottom: calc(${(props) => props.theme.spacing} * 4);
`;

export const ProfileError = styled(Error)`
  margin: ${(props) => props.theme.spacingHalf};
`;

export const ProfileSection = styled.section`
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export const ProfileRow = styled.section`
  display: flex;
  align-items: center;
  max-width: 19.5rem;
`;

export const ProfileStatus = styled(ProfileSection)`
  margin-bottom: ${(props) => props.theme.spacing};
`;

export const ProfileHeader = styled(ProfileSection)`
  display: flex;
  align-items: center;
`;

export const ProfileName = styled.span`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

export const ProfileAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

export const ProfileGroup = styled.section<{ horizontal: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${(props) =>
    props.horizontal ? 'flex-direction:row' : 'flex-direction:column'};
`;

export const ProfileTile = styled.section`
  position: relative;
  padding: ${(props) => props.theme.spacingHalf}
    ${(props) => props.theme.spacing};
  margin: ${(props) => props.theme.spacingHalf};
  margin-top: 0;
  margin-left: 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

export const ProfileTileBorder = styled(Frame)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const ProfileHeading = styled.h2`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
`;

export const ProfileBlurbsSection = styled.section<{ isLoading: boolean }>`
  margin: ${(props) => props.theme.spacingHalf} 0
    ${(props) => props.theme.spacing} 0;

  ${(props) => props.isLoading && `opacity: .7`};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
`;

export const ProfileBlurb = styled.section<{ secondary: boolean }>`
  display: inline-block;
  ${(props) => props.secondary && `color: ${props.theme.secondaryTextColor}`};
  line-height: ${(props) => props.theme.normalFontLineHight};
  padding: 8px;
  padding-left: 15px;
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

export const ProfileInput = styled.input`
  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};

  box-sizing: border-box;
  width: 100%;
  min-width: calc(${MOBILE_MIN});
  margin: calc(0px - ${(props) => props.theme.border} / 2)
    ${(props) => props.theme.spacingHalf} 0
    calc(0px - ${(props) => props.theme.border});
  padding: 8px;

  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};

  &:focus {
    outline: none;
    border: ${(props) => props.theme.border} solid
      ${(props) => props.theme.backgroundColor};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
  }

  @media (max-width: ${MOBILE}) {
    min-width: initial;
  }
`;

export const ProfileField = styled.section`
  display: inline-block;
  height: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingThird}
  );

  @media (max-width: ${MOBILE}) {
    height: initial;
    flex: 1;
  }
`;

export const ReactionList = styled.section`
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

export const ReactionRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacingQuarter};
`;

export const ReactionTypeIcon = styled.div`
  margin-right: ${(props) => props.theme.spacingHalf};
`;

export const ReactionFilterButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.secondaryTextColor};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
`;

export const ReactionBadge = styled.span`
  font-family: ${(props) => props.theme.smallFont};
  font-weight: ${(props) => props.theme.smallFontWeight};
  font-size: ${(props) => props.theme.smallFontSize};
  margin-left: ${(props) => props.theme.spacingQuarter};
`;

export const ReactionDescription = styled.div`
  flex: 1 1;
`;

export const SecondaryText = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

export const ReactionDate = styled.div`
  margin-left: ${(props) => props.theme.spacing};
  min-width: 6em;
`;

export const StaticDate = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

export const LinkButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};

  padding: ${(props) => props.theme.spacingQuarter};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  transition: color ${(props) => props.theme.animationFast} ease-out;

  color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.accentTextColor};

  &:focus {
    border-radius: ${(props) => props.theme.borderRadius};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
    outline: none;
  }

  &:hover {
    text-decoration: underline;
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryLightColor
        : props.theme.primaryDarkColor};
  }
`;

export const InlineLinkButton = styled(LinkButton)`
  display: inline-block;

  [disabled] {
    opacity: 0.5;
  }
`;

export const ImageLinkButton = styled.button`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  align-self: center;
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

export const BlockLinkButton = styled(LinkButton)`
  margin-left: ${(props) => props.theme.spacing};
  margin-top: ${(props) => props.theme.spacingHalf};
`;

export const StyledBlurbIcon = styled(BlurbIcon)`
  flex-shrink: 0;
  flex-basis: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingQuarter}
  );

  @media (max-width: ${MOBILE}) {
    margin-top: calc(0px - ${(props) => props.theme.border});
  }
`;

export const StyledLocationIcon = styled(LocationIcon)`
  flex-shrink: 0;
  flex-basis: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingQuarter}
  );
  margin-top: calc(0px - ${(props) => props.theme.border});
`;
