/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Site-wide constants.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { Reaction } from './types/AllCommentsQuery';

// Media query: slide content over to display inline comments on the side
export const NARROW_SIDE_COMMENTS = '1400px';
// Media query: overlay inline comments over content
export const NARROW_INLINE_COMMENTS = '1750px';
// Media query: hide content marker metadata
export const NARROW_NO_MARKER_LABELS = '1195px';
// Media query: flip content markers and buttons from right to left
export const NARROW_FLIP_MARKERS = '1148px';
// Media query: hide rulers and other decorations in gutters
export const NARROW_NO_RULERS = '1070px';
// Media query: tablet layout
export const MOBILE = '1020px';
// Media query: wide mobile layout;
export const MOBILE_WIDE = '690px';
// Media query: narrow mobile layout
export const MOBILE_NARROW = '540px';
// Media query: minimum mobile layout
export const MOBILE_MIN = '380px';

// Inline comment sidebar sizes
export const SIDE_COMMENTS_SIZE = 7;
export const SIDE_COMMENTS_MIN_WIDTH = `${SIDE_COMMENTS_SIZE}em`;
export const SIDE_COMMENTS_WIDTH = `${SIDE_COMMENTS_SIZE + 2}em`;
export const SIDE_COMMENTS_MAX_WIDTH = '25em';

// Honeycomb cell pattern
export const CELL_WIDTH = 44;
export const CELL_HEIGHT = 38;
// Expected cell icon size
export const CELL_ICON_SIZE = 36;
// Width of a single interweaved repeat of 4 honeycomb cells
export const CELL_ROW_WIDTH = 140;
// Height of two interweaved rows of honeycomb cells
export const CELL_STRIP_HEIGHT = 56.5;
// Pixel offsets in multi-row honeycomb pattern
export const CELL_PATTERN: { x: number; y: number }[] = [
  { x: 0, y: 38 },
  { x: 32, y: 56.5 },
  { x: 64, y: 38 },
  { x: 96, y: 56.5 },
  { x: 0, y: 75 },
  { x: 96, y: 19.5 },
  { x: 32, y: 19.5 },
  { x: 64, y: 75 },
  { x: 0, y: 1 },
  { x: 64, y: 1 },
  // more than 10 tags would be visual overload for the user
];

// Authentication endpoint URL
export const AUTH_URL =
  'https://5b9fvh31di.execute-api.us-west-2.amazonaws.com/Prod';

// Social reaction descriptors
export const REACTION_NAMES: Record<Reaction, string> = {
  snap: 'snapped to',
  party: 'popped a four loko to',
  lol: 'lolled about',
  wow: 'lost his diddly about',
  confused: 'yeeted to',
};
