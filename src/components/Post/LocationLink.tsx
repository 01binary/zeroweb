import React, { FC, useRef } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';
import ExternalMetaLink from '../ExternalMetaLink';

const LocationLink: FC<{
  displayName?: string;
  locationUrl?: string;
  showLocationTipFor: ShowTipForHandler;
  hideLocationTip: HideTipHandler;
}> = ({ displayName, locationUrl, showLocationTipFor, hideLocationTip }) => {
  const locationRef = useRef<HTMLElement>();

  return (
    <ExternalMetaLink
      ref={locationRef}
      target="_blank"
      rel="noopener noreferrer"
      href={locationUrl}
      onMouseOver={() => showLocationTipFor(displayName ?? null, locationRef)}
      onMouseOut={hideLocationTip}
    >
      {displayName}
    </ExternalMetaLink>
  );
};

export default LocationLink;
