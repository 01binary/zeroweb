import React from 'react';

export const AVATAR_SIZE = 38;

const Avatar = ({ avatarUrl }) => (
  <svg width="38" height="44" viewBox="0 0 38 44">
    <defs>
      <clipPath id="avatar-clip">
        <polygon points="0.5,11.3 0.5,32.7 19,43.3 37.5,32.7 37.5,11.3 19,0.6" />
      </clipPath>
    </defs>
    <polygon
      className="stroke-border fill-opaque"
      points="0.5,11.3 0.5,32.7 19,43.3 37.5,32.7 37.5,11.3 19,0.6"
    />
    <image
      clipPath="url(#avatar-clip)"
      x="-2"
      y="1"
      width={`${AVATAR_SIZE + 4}px`}
      height={`${AVATAR_SIZE + 4}px`}
      xlinkHref={avatarUrl}
    />
  </svg>
);

export default Avatar;
