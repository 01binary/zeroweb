import React, { FC } from 'react';
import styled from 'styled-components';
import Avatar from '../Avatar';
import LocationIcon from '../../images/location.svg';
import BlurbIcon from '../../images/blurb.svg';

const LocationInfo = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LocationDetails = styled.section`
  margin: ${(props) => props.theme.spacingHalf} 0 0
    ${(props) => props.theme.spacingQuarter};
`;

const LocationGroup = styled(LocationInfo)`
  margin-bottom: ${(props) => props.theme.spacingQuarter};
`;

const LocationText = styled.span<{ secondary: boolean }>`
  ${(props) => props.secondary && `opacity: .7`};
  margin: 0 0 0 ${(props) => props.theme.spacingHalf};
  max-width: 15em;
  white-space: pre-wrap;
  text-transform: initial;
`;

const StyledBlurbIcon = styled(BlurbIcon)`
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const StyledLocationIcon = styled(LocationIcon)`
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

type LocationTipProps = {
  displayName: string;
  locationName: string;
  avatarUrl: string;
  description: string;
};

const LocationTip: FC<LocationTipProps> = ({
  displayName,
  locationName,
  avatarUrl,
  description,
}) => (
  <>
    <LocationInfo>
      <Avatar avatarUrl={avatarUrl} />
      <LocationText>{displayName}</LocationText>
    </LocationInfo>
    <LocationDetails>
      {description && (
        <LocationGroup>
          <StyledBlurbIcon />
          <LocationText>{description}</LocationText>
        </LocationGroup>
      )}
      {locationName && (
        <LocationGroup>
          <StyledLocationIcon />
          <LocationText secondary>{locationName}</LocationText>
        </LocationGroup>
      )}
    </LocationDetails>
  </>
);

export default LocationTip;
