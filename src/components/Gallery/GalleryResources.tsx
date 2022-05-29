import React, { FC } from 'react';

export const GalleryDefs: FC = () => (
  <svg className="hide">
    <defs>
      <clipPath id="gallery-mask">
        <polygon points="0,32.1 55.5,0 111,32.1 111,96 55.5,128.1 0,96 " />
      </clipPath>
      <polygon
        id="gallery-focus"
        className="fill-none stroke-focus"
        points="0,32.1 55.5,0 111,32.1 111,96 55.5,128.1 0,96 "
      />
      <polygon
        id="gallery-border"
        className="fill-none stroke-border"
        points="0,32.1 55.5,0 111,32.1 111,96 55.5,128.1 0,96 "
      />
      <linearGradient
        id="gallery-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="112"
        y2="130"
      >
        <stop offset="0" stopColor="#40A7F0" />
        <stop offset="0.1171" stopColor="#788BED" />
        <stop offset="0.2466" stopColor="#AE6FE9" />
        <stop offset="0.3585" stopColor="#D65AE7" />
        <stop offset="0.447" stopColor="#EF4EE6" />
        <stop offset="0.5011" stopColor="#F849E5" />
        <stop offset="0.5427" stopColor="#F94CD2" />
        <stop offset="0.6343" stopColor="#FB53AE" />
        <stop offset="0.7264" stopColor="#FD5891" />
        <stop offset="0.8182" stopColor="#FE5B7D" />
        <stop offset="0.9095" stopColor="#FF5D71" />
        <stop offset="1" stopColor="#FF5E6D" />
      </linearGradient>

      <g id="row_narrow_even_middle">
        <polyline points="332.9,192 332.9,128.1 388.4,96 " />
        <polyline points="221.9,128.1 277.4,96 332.9,128.1 332.9,192 " />
        <polyline points="111,192 111,128.1 166.5,96 221.9,128.1 221.9,192 " />
        <polyline points="0,128.1 55.5,96 111,128.1 111,192 " />
        <polyline points="55.5,224.1 111,192 166.5,224.1 " />
        <polyline points="388.4,96 332.9,128.1 277.4,96 277.4,32.1 " />
        <polyline points="0,128.1 55.5,96 55.5,32.1 111,0 166.5,32.1 166.5,96 111,128.1 55.5,96 55.5,32.1 " />
        <polyline points="166.5,32.1 221.9,0 277.4,32.1 277.4,96 221.9,128.1 166.5,96 166.5,32.1 " />
        <line x1="277.4" y1="32.1" x2="332.9" y2="0" />
      </g>
      <g id="row_narrow_even">
        <polyline
          strokeMiterlimit="10"
          points="332.9,192 332.9,128.1 388.4,96 "
        />
        <polyline
          strokeMiterlimit="10"
          points="221.9,128.1 277.4,96 332.9,128.1 332.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="111,192 111,128.1 166.5,96 221.9,128.1 221.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="0,128.1 55.5,96 111,128.1 111,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="388.4,96 332.9,128.1 277.4,96 277.4,32.1 "
        />
        <polyline
          strokeMiterlimit="10"
          points="0,128.1 55.5,96 55.5,32.1 111,0 166.5,32.1 166.5,96 111,128.1 55.5,96 
	55.5,32.1 "
        />
        <polyline
          strokeMiterlimit="10"
          points="166.5,32.1 221.9,0 277.4,32.1 277.4,96 221.9,128.1 166.5,96 166.5,32.1 "
        />
        <line x1="277.4" y1="32.1" x2="332.9" y2="0" />
      </g>
      <g id="row_narrow_odd">
        <polyline
          strokeMiterlimit="10"
          points="332.9,192 332.9,128.1 388.4,96 "
        />
        <polyline
          strokeMiterlimit="10"
          points="221.9,128.1 277.4,96 332.9,128.1 332.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="111,192 111,128.1 166.5,96 221.9,128.1 221.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="0,128.1 55.5,96 111,128.1 111,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="388.4,96 332.9,128.1 277.4,96 277.4,32.1 "
        />
        <polyline
          strokeMiterlimit="10"
          points="277.4,32.1 277.4,96 221.9,128.1 166.5,96 166.5,32.1 "
        />
        <polyline
          id="edge_x5F_r1c2"
          strokeMiterlimit="10"
          points="166.5,32.1 166.5,96 111,128.1 55.5,96 55.5,32.1 "
        />
        <polyline strokeMiterlimit="10" points="55.5,32.1 55.5,96 0,128.1 " />
      </g>
      <g id="row_wide_even">
        <polyline
          strokeMiterlimit="10"
          points="443.9,192 443.9,128.1 499.4,96 554.9,128.1 554.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="332.9,128.1 388.4,96 443.9,128.1 443.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="221.9,192 221.9,128.1 277.4,96 332.9,128.1 332.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="111,192 111,128.1 166.5,96 221.9,128.1 221.9,192 "
        />
        <polyline
          strokeMiterlimit="10"
          points="0,128.1 55.5,96 111,128.1 111,192 "
        />
        <polygon
          strokeMiterlimit="10"
          points="111,0 55.5,32.1 55.5,96 111,128.1 166.5,96 166.5,32.1 "
        />
        <polygon
          strokeMiterlimit="10"
          points="221.9,0 166.5,32.1 166.5,96 221.9,128.1 277.4,96 277.4,32.1 "
        />
        <polygon
          strokeMiterlimit="10"
          points="332.9,0 277.4,32.1 277.4,96 332.9,128.1 388.4,96 388.4,32.1 "
        />
        <polygon
          strokeMiterlimit="10"
          points="443.9,0 388.4,32.1 388.4,96 443.9,128.1 499.4,96 499.4,32.1 "
        />
        <polyline points="554.9,0 499.4,32.1 499.4,96 554.9,128.1 610.3,96 " />
      </g>
      <g id="row_wide_odd">
        <polyline
          strokeMiterlimit="10"
          points="443.9,192 443.9,128.1 499.4,96 554.9,128.1 554.9,192 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="332.9,128.1 388.4,96 443.9,128.1 443.9,192 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="221.9,192 221.9,128.1 277.4,96 332.9,128.1 332.9,192 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="111,192 111,128.1 166.5,96 221.9,128.1 221.9,192 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="0,128.1 55.5,96 111,128.1 111,192 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="610.3,96 554.9,128.1 499.4,96 499.4,32.1 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="499.4,32.1 499.4,96 443.9,128.1 388.4,96 388.4,32.1 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="388.4,32.1 388.4,96 332.9,128.1 277.4,96 277.4,32.1 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="277.4,32.1 277.4,96 221.9,128.1 166.5,96 166.5,32.1 	"
        />
        <polyline
          strokeMiterlimit="10"
          points="166.5,32.1 166.5,96 111,128.1 55.5,96 55.5,32.1 	"
        />
      </g>
    </defs>
  </svg>
);

export const GalleryRowCellBorders: FC = () => (
  <>
    <svg
      className="border border--wide border--even fill-none stroke-border"
      width="610.5px"
      height="224px"
      viewBox="0 0 610.5 224"
    >
      <use xlinkHref="#row_wide_odd" />
    </svg>
    <svg
      className="border border--wide border--odd fill-none stroke-border"
      width="610.5px"
      height="224px"
      viewBox="0 0 610.5 224"
    >
      <use xlinkHref="#row_wide_even" />
    </svg>
    <svg
      className="border border--narrow border--even fill-none stroke-border"
      width="388.5px"
      height="224px"
      viewBox="0 0 388.5 224"
    >
      <use xlinkHref="#row_narrow_odd" />
    </svg>
    <svg
      className="border border--narrow border--odd fill-none stroke-border"
      width="388.5px"
      height="224px"
      viewBox="0 0 388.5 224"
    >
      <use xlinkHref="#row_narrow_even" />
    </svg>
    <svg
      className="border border--narrow border--odd--middle fill-none stroke-border"
      width="388.5px"
      height="224px"
      viewBox="0 0 388.5 224"
    >
      <use xlinkHref="#row_narrow_even_middle" />
    </svg>
  </>
);

export const GalleryCellFocusOutline: FC = () => (
  <svg className="focus" width="112px" height="128.1px" viewBox="0 0 112 128.1">
    <use xlinkHref="#gallery-focus" />
  </svg>
);

export const GalleryImageCell: FC<{ src: string }> = ({ src }) => (
  <svg width="112px" height="128.1px" viewBox="0 0 112 128.1">
    <image clipPath="url(#gallery-mask)" height="128.5px" xlinkHref={src} />
    <rect
      className="hover"
      clipPath="url(#gallery-mask)"
      fill="url(#gallery-gradient)"
      style={{ mixBlendMode: 'soft-light' }}
      width="111"
      height="128.1"
    />
    <use className="border" xlinkHref="#gallery-border" />
    <use className="focus" xlinkHref="#gallery-focus" />
  </svg>
);
