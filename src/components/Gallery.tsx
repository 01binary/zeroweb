import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { MOBILE_MIN } from '../constants';
import Alert from '../components/Alert';
import Error from '../components/Error';
import { Link } from 'gatsby';

const ROW_HEIGHT = 191.952;
const WIDE_WIDTH = 610.5;
const NARROW_WIDTH = 388.5;
const SPACING = 32;

const WIDE_MEDIA = `(max-width: ${WIDE_WIDTH + SPACING}px)`;

const COORDS_WIDE = [
  {
    titleX: 55.486,
    titleY: 32.092,
    imageX: 166.459,
    imageY: 0,
  },
  {
    titleX: 277.431,
    titleY: 32.092,
    imageX: 388.404,
    imageY: 0,
  },
  {
    titleX: 110.972,
    titleY: 128.068,
    imageX: 221.945,
    imageY: 95.976,
  },
  {
    titleX: 332.917,
    titleY: 128.068,
    imageX: 443.89,
    imageY: 95.976,
  },
];

const COORDS_NARROW = [
  {
    titleX: 55.486,
    titleY: 32.092,
    imageX: 166.459,
    imageY: 0,
  },
  {
    titleX: 110.972,
    titleY: 128.068,
    imageX: 221.945,
    imageY: 95.976,
  },
];

const getThumbnail = (set: string[]): string => set[1];

const GalleryWrapper = styled.section`
  display: flex;
  flex-direction: column;

  margin: 0 auto;
  width: ${WIDE_WIDTH}px;
  padding-top: ${(props) => props.theme.spacingHalf};
  padding-bottom: ${(props) => props.theme.spacingOneAndHalf};

  svg {
    position: absolute;
    left: 0;
    top: 0;
  }

  @media ${WIDE_MEDIA} {
    width: ${NARROW_WIDTH}px;
  }

  @media (max-width: ${MOBILE_MIN}) {
    width: ${NARROW_WIDTH}px;
    margin: 0 calc(0px - ${(props) => props.theme.spacingHalf});
  }
`;

const GalleryRow = styled.section`
  position: relative;
  width: 100%;
  height: ${ROW_HEIGHT}px;

  .border {
    pointer-events: none;
  }

  &:nth-child(even) {
    .border--even {
      display: block;
    }

    .border--odd {
      display: none;
    }

    .border--odd--middle {
      display: none;
    }
  }

  &:nth-child(odd) {
    .border--even {
      display: none;
    }

    .border--odd {
      display: none;
    }

    .border--odd--middle {
      display: block;
    }
  }

  &:nth-child(odd):last-child {
    .border--even {
      display: none;
    }

    .border--odd {
      display: block;
    }

    .border--odd--middle {
      display: none;
    }
  }

  @media ${WIDE_MEDIA} {
    .border--narrow {
      display: block;
    }

    .border--wide {
      display: none !important;
    }
  }
`;

const GalleryError = styled(Error)`
  padding: ${(props) => props.theme.spacingHalf};
`;

const GalleryLabelLink = styled(Link)`
  position: absolute;
  left: ${(props) => props.coords[props.index].titleX}px;
  top: ${(props) => props.coords[props.index].titleY}px;

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;

  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: ${(props) => props.theme.smallFontWeight};

  width: calc(111px - ${(props) => props.theme.spacingHalf});
  height: calc(64px - ${(props) => props.theme.spacingHalf});
  padding: ${(props) => props.theme.spacingQuarter};

  .focus {
    position: absolute;
    left: 0;
    top: calc(0px - ${SPACING}px);
    display: none;
  }

  &:hover {
    text-decoration: none;
  }

  &:focus {
    box-shadow: none;

    .focus {
      display: block;
    }
  }
`;

const GalleryImageLink = styled.a`
  position: absolute;
  left: ${(props) => props.coords[props.index].imageX}px;
  top: ${(props) => props.coords[props.index].imageY}px;

  .hover {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .focus {
    display: none;
  }

  &:hover {
    .hover {
      opacity: 1;
    }
  }

  &:focus {
    box-shadow: none;
    border-radius: initial;

    .focus {
      display: block;
    }

    .border {
      display: none;
    }
  }
`;

type GalleryImage = {
  // Alternative text
  title: string;
  // Full size
  src: string;
  // All available sizes
  set: string;
  // Link target to see full image
  href: string;
};

type GalleryProps = {
  images: GalleryImage[];
};

const Gallery: FC<GalleryProps> = ({ images }) => {
  const [isNarrow, setNarrow] = useState<boolean>(false);

  const handleWatchNarrow = useCallback(
    (ev: MediaQueryListEvent) => {
      setNarrow(ev.matches);
    },
    [setNarrow]
  );

  useEffect(() => {
    if (typeof window === `undefined`) return;

    const media = window.matchMedia(WIDE_MEDIA);
    media.addEventListener('change', handleWatchNarrow);

    setNarrow(media.matches);

    return () =>
      window
        .matchMedia(WIDE_MEDIA)
        .removeEventListener('change', handleWatchNarrow);
  }, [setNarrow, handleWatchNarrow]);

  if (!images?.length)
    return (
      <Alert fullWidth>
        <GalleryError>
          No images in the gallery, or one or more images couldn't be found
        </GalleryError>
      </Alert>
    );

  const coords = isNarrow ? COORDS_NARROW : COORDS_WIDE;
  const { rows } = useMemo(
    () =>
      images.reduce(
        ({ rows, row }, image: GalleryImage, index) => {
          if (row.length + 1 === coords.length || index + 1 === images.length) {
            return {
              rows: [...rows, [...row, image]],
              row: [],
            };
          }

          return {
            rows,
            row: [...row, image],
          };
        },
        { rows: [], row: [] }
      ),
    [images, coords]
  );

  return (
    <GalleryWrapper>
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
            <polyline
              strokeMiterlimit="10"
              points="55.5,32.1 55.5,96 0,128.1 "
            />
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
      {rows.map((imagesInRow, rowIndex) => (
        <GalleryRow key={`row${rowIndex}`} index={rowIndex} coords={coords}>
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
          {imagesInRow.map(({ set, title, href }, imageIndex) => (
            <>
              <GalleryLabelLink
                index={imageIndex}
                coords={coords}
                href={href}
                target="_blank"
              >
                {'+ '}
                {title}
                <svg
                  className="focus"
                  width="112px"
                  height="128.1px"
                  viewBox="0 0 112 128.1"
                >
                  <use xlinkHref="#gallery-focus" />
                </svg>
              </GalleryLabelLink>
              <GalleryImageLink
                index={imageIndex}
                coords={coords}
                href={href}
                target="_blank"
              >
                <svg width="112px" height="128.1px" viewBox="0 0 112 128.1">
                  <image
                    clipPath="url(#gallery-mask)"
                    height="128.5px"
                    xlinkHref={getThumbnail(set)}
                  />
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
              </GalleryImageLink>
            </>
          ))}
        </GalleryRow>
      ))}
    </GalleryWrapper>
  );
};

export default Gallery;
