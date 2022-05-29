/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gallery helper functions
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { GalleryImage, SourceImage } from './galleryTypes';

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

export const getSourceSize = (match: string, sourceImages: SourceImage[]) =>
  sourceImages.find(({ source }) => source === match);

export const getThumbnail = (set: string[]): string => set[1];

export const getRowPlacement = (isNarrow: boolean) =>
  isNarrow ? COORDS_NARROW : COORDS_WIDE;

export const getRowCells = (
  coords: ReturnType<typeof getRowPlacement>,
  images: GalleryImage[]
) =>
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
    { rows: [], row: [] } as { rows: GalleryImage[][]; row: GalleryImage[] }
  ).rows;
