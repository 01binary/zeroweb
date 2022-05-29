/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gallery created by wrapping images into <Gallery></Gallery>
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm';
import 'photoswipe/dist/photoswipe.css';
import './Gallery.overrides.css';
import Alert from '../Alert';
import {
  GalleryError,
  GalleryImageLink,
  GalleryLabel,
  GalleryRow,
  GalleryWrapper,
} from './Gallery.styles';
import GalleryContext from './GalleryContext';
import {
  getRowCells,
  getRowPlacement,
  getSourceSize,
  getThumbnail,
} from './galleryUtils';
import { GalleryImage } from './galleryTypes';
import {
  GalleryCellFocusOutline,
  GalleryDefs,
  GalleryImageCell,
  GalleryRowCellBorders,
} from './GalleryResources';

const WIDE_WIDTH = 610.5;
const SPACING = 32;
const WIDE_MEDIA = `(max-width: ${WIDE_WIDTH + SPACING}px)`;

type GalleryProps = {
  galleryId: string;
  images: GalleryImage[];
};

const Gallery: FC<GalleryProps> = ({ galleryId, images }) => {
  const [isNarrow, setNarrow] = useState<boolean>(false);
  const { sourceImages } = useContext(GalleryContext);
  const coords = getRowPlacement(isNarrow);
  const rows = useMemo(() => getRowCells(coords, images), [images, coords]);

  const handleWatchNarrow = useCallback(
    (ev: MediaQueryListEvent) => {
      setNarrow(ev.matches);
    },
    [setNarrow]
  );

  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === `undefined`) return;

    const media = window.matchMedia(WIDE_MEDIA);
    media.addEventListener?.('change', handleWatchNarrow);

    setNarrow(media.matches);

    if (!media.addEventListener) return;
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

  return (
    <GalleryWrapper id={galleryId}>
      <GalleryDefs />
      {rows.map((imagesInRow, rowIndex) => (
        <GalleryRow key={`row${rowIndex}`}>
          <GalleryRowCellBorders />
          {imagesInRow.map(
            ({ set, title, href, original, srcSet }, imageIndex) => {
              const labelLeft = `${coords[imageIndex].titleX}px`;
              const labelTop = `${coords[imageIndex].titleY}px`;
              const imageLeft = `${coords[imageIndex].imageX}px`;
              const imageTop = `${coords[imageIndex].imageY}px`;
              return (
                <div key={original}>
                  <GalleryLabel
                    index={imageIndex}
                    style={{ left: labelLeft, top: labelTop }}
                  >
                    {title}
                    <GalleryCellFocusOutline />
                  </GalleryLabel>
                  <GalleryImageLink
                    index={imageIndex}
                    coords={coords}
                    href={href}
                    target="_blank"
                    data-pswp-width={
                      getSourceSize(original, sourceImages).width
                    }
                    data-pswp-height={
                      getSourceSize(original, sourceImages).height
                    }
                    data-pswp-srcset={srcSet}
                    style={{ left: imageLeft, top: imageTop }}
                  >
                    <GalleryImageCell src={getThumbnail(set)} />
                  </GalleryImageLink>
                </div>
              );
            }
          )}
        </GalleryRow>
      ))}
    </GalleryWrapper>
  );
};

export default Gallery;
