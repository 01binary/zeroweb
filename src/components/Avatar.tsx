import React from 'react';

const AVATAR_SIZE = 24;

const Avatar = ({ avatarUrl }) => (
  <svg width="44" height="38" viewBox="0 0 44 38">
    <defs>
      <clipPath id="avatar-clip">
        <polygon points="32.6,0.5 11.3,0.5 0.6,19 11.3,37.5 32.6,37.5 43.3,19"/>
      </clipPath>
    </defs>
    <polygon className="stroke-border fill-none" points="32.6,0.5 11.3,0.5 0.6,19 11.3,37.5 32.6,37.5 43.3,19"/>
    <image clipPath="url(#avatar-clip)" x="10" y="7" width={`${AVATAR_SIZE}px`} height={`${AVATAR_SIZE}px`} xlinkHref={avatarUrl}/>
  </svg>
);

export default Avatar;
