/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Constants.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

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
// Media query: basic mobile layout
export const MOBILE = '1020px';
// Media query: narrow mobile layout
export const MOBILE_NARROW = '540px';
// Media query: minimum mobile layout
export const MOBILE_MIN = '380px';

// Inline comment sidebar sizes
const SIDE_COMMENTS_SIZE = 7;
export const SIDE_COMMENTS_MIN_WIDTH = `${SIDE_COMMENTS_SIZE}em`;
export const SIDE_COMMENTS_WIDTH = `${SIDE_COMMENTS_SIZE + 2}em`;
export const SIDE_COMMENTS_MAX_WIDTH = '25em';

// Authentication endpoint URL
export const AUTH_URL =
  'https://5b9fvh31di.execute-api.us-west-2.amazonaws.com/Prod';
