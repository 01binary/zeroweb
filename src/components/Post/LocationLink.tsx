import React, { FC, useRef } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';
import ExternalMetaLink from '../ExternalMetaLink';

type LocationLinkProps = {
  displayName?: string;
  locationUrl: string;
  showLocationTipFor: ShowTipForHandler;
  hideLocationTip: HideTipHandler;
};

const LocationLink: FC<LocationLinkProps> = ({
  displayName,
  locationUrl,
  showLocationTipFor,
  hideLocationTip,
}) => {
  const locationRef = useRef<HTMLElement>();

  return (
    <ExternalMetaLink
      ref={locationRef}
      target="_blank"
      rel="noopener noreferrer"
      href={locationUrl}
      onMouseOver={() => showLocationTipFor(displayName, locationRef)}
      onMouseOut={hideLocationTip}
    >
      {displayName}
    </ExternalMetaLink>
  );
};

export default LocationLink;
