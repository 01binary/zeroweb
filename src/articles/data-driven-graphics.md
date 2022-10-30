---
title: Data Driven Graphics in React
description: Interactive graphics that delight users and increase revenue
image: ./images/data-driven-graphics.png
author: Valeriy Novytskyy
date: 2022-07-27
pinned: true
location: Lewis River Falls
tags:
  [
    'production',
    'design-graphic',
    'tool-js',
    'tool-illustrator',
  ]
---

import GaugeExample from './components/gauge-example';
import ChainsawExample from './components/chainsaw-example';
import TapeExample from './components/tape-example';
import ExperimentExample from './components/experiment-example';
import ClockExample from './components/clock-example';
import ControlledExample from './components/controlled-example';

## motivation

Interactive graphics and animation on the web can be useful for many reasons.

- They increase engagement by providing additional visual feedback to keep users on your site longer, which leads to higher monetization.
- Interactive features on educational sites help students understand the material better and keep their attention, resulting in higher scores.
- Online instruction manuals can walk users through the steps of a complicated process (like an automated COVID test) to realize significant savings on customer service calls and improve product ratings.

Thanks to modern web development with React, SVG, and CSS, the cost of creating interactive animations is at its lowest ever.

## rotary gauge demo

Starting with the basics, a rotary gauge can be created by specifying the `transform: rotation()` inline style of an SVG element as an expression that converts the value of a changing state variable to degrees.

<GaugeExample />

The `transform-origin` style must be set to the point the element will rotate around, in this case the bottom left edge of the arrow (by default it's the top left of the SVG's `viewbox`). The `transition` style can also be set to animate the element smoothly to the next state.

```
const Gauge: FC<{ position: number }> = ({ position }) => (
  <svg viewBox="0 0 64 48">
    ...
    <polygon
      id="arrow"
      style={{
        transformOrigin: '45.634px 47.543px',
        transform: `rotate(${position * 90}deg)`,
        transition: 'transform 0.3s ease-in-out',
      }}
      ...
    />
  </svg>
);
```

In this example we are changing styles dynamically by using the inline `style` attribute on the SVG element instead of re-writing CSS styles.

> When using a styling library like `styled-components` you will be warned when your style changes more than a hundred times or so, because extra work has to be done to create a new style and insert it into the DOM.

The slider position (`0` through `1`) is multiplied by 90 which results in a `0deg` to `90deg` range of motion for the gauge arrow.

## chainsaw demo

This example demonstrates how to animate a stroke dash offset on a path in preparation to making this motion data-driven in the next example.

<ChainsawExample />

The following animation advances the `stroke-dashoffset` on the "chain" by the distance to the next dash. The chainsaw stroke is styled with `stroke-dasharray="10,8"`, therefore a step from one dash to the next is `10px` (the dash length) + `8px` (the space between dashes), giving a total of `18`.

The direction of the offset depends on the order of points in the path being stroked. In this case the path has been drawn clockwise so the dash offset moved clockwise. Adding a `-` to the offset reversed the direction.

```
const Chainsaw = styled(ChainsawIllustration)`
  #chain {
    animation: saw 0.1s linear infinite;
  }

  @keyframes saw {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -18;
    }
  }
`;
```

## tape deck demo

The next example animates the rotation of reels on a tape deck in addition to the offset of a dashed stroke on the tape, and the direction of "chevrons" to indicate which way the tape is moving.

<TapeExample />

To rotate the reels, set `transform-origin` inline style on groups containing reel graphics to the origin of each reel's rotation, which is simple to look up from their `circle` element's `cx` (center x) and `cy` (center y) attributes, then use `transform: rotate()` to convert the "position" state into rotation.

```
const TapePlayer: FC<{
  position: number;
  forward: boolean
}> = ({
  position,
  forward,
}) => (
  <svg viewBox="0 0 135 64">
    ...
    <g
      id="tape"
      strokeDashoffset={`${(1 - position) * 10}px`}
      style={{ transition: 'stroke-dashoffset .5s ease-in-out' }}
    >
      ...
    </g>
    ...
    <g
      id="chevrons"
      style={
        forward
          ? {}
          : {
              transform: 'scaleX(-1)',
              transformOrigin: '67px'
            }
      }
    >
      ...
    </g>
    ...
    <g
      id="reel2"
      style={{
        transform: `rotate(${position * 360}deg)`,
        transformOrigin: '107.4px 27.4px',
        transition: 'transform .5s ease-in-out',
      }}
    >
     ...
    </g>
    <g
      id="reel1"
      style={{
        transform: `rotate(${position * 360}deg)`,
        transformOrigin: '27.2px 26.8px',
        transition: 'transform .5s ease-in-out',
      }}
    >
      ...
    </g>
  </svg>
);
```

To offset the dashed stroke on the tape, set the `stroke-dashoffset` inline style. In this example we would like the tape to move clockwise when the position increases and counter-clockwise when the position decreases.

The `stroke-dashoffset` moves it the opposite way, so we reverse the direction of movement by subtracting the normalized position from `1.0`. The range of movement is set by using a multiplier like `10` so that the normalized position `0.0` through `1.0` results in an offset between `0px` and `10px`.

To reverse the direction of the "chevrons" in the middle of the deck, use the `transform: scaleX()` inline style in conjunction with `transform-origin` to set the point from which the scaling occurs.

You can also set the CSS `transition` property for all animated elements to have them move smoothly.

## a physics experiment

My favorite subject in school was physics because I loved playing with the classroom electronics equipment like meters, switches, and batteries.

The illustration below is based on the Soviet physics classroom equipment from my school in Ukraine in the early 1990s. The industrial design of these objects echoes the "constructivist" style popular at the time, with bold, blocky shapes and energetic grayscale, red, and blue color scheme.

<ExperimentExample />

Are you ready? Here are your instructions:
1. Throw the knife switch to magnetize the coil (`switch` slider)
2. Slide the rod connected to the galvanometer (`magnet` slider)
3. Observe that moving the rod through the magnetic field generates electrical current via induction
4. Moving the rod forward generates positive current of `+5 uA`, and moving it back generates a negative current of `-5 uA`.

Imagine that your classroom only has enough kit to prepare a few of these experiments so the students must share.  If they could simulate the experiment, they would know what to expect once they get their turn and finish on time.

This also gives students something to do while waiting in line and could enable remote students to participate in the lab.

The techniques used for this interactive illustration are repeated from the previous sections with the exception of using linear interpolations to move the rod across the magnet with the wires remaining attached.

The rod is moved using a CSS `transform`:

```
...
<g
  id="magnet"
  style={{
    transform: `translate(${interpolate(
      -49.3,
      12.2,
      76.32,
      -20.75,
      magnetPosition,
      'px'
    )})`,
  }}
>
...
```

The wires are moved by updating coordinates of their last `path` point:

```
...
<path
  id="bluewire"
  ...
  d={`M798.9,361.2C963.7,509.5,1390.6,148,${interpolate(
    1349,
    323,
    1475,
    290,
    magnetPosition
  )}`}
/>
<path
  id="redwire"
  ...
  d={`M754.6,400.2C963.7,550,1390.6,170,${interpolate(
    1372,
    330,
    1498,
    297,
    magnetPosition
  )}`}
/>
```

The linear iterpolation function works great for this use case (it expects `position` normalized to `0.0 - 1.0` range):

```
const interpolate = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  position: number,
  units?: string
) =>
  `${
    x1 + (x2 - x1) * position
  }${
    units ?? ''
  },${
    y1 + (y2 - y1) * position
  }${
    units ?? ''
  }`;
```

## frame by frame

In addition to data-driven animations you may have to loop or trigger static frame-by-frame animations. The use-cases are numerous ranging from enhancing visualizations to creating delightful, memorable experiences.

> There is an easter egg in the previous experiment. Moving the rod rapidly back-and-forth across the magnet will fade in a Beavis and Butthead chortling animation (in honor of the new feature release by Mike Judge).

To create a frame-by-frame animation:

1. Group the artwork for each frame and name the groups, for example `hello1`, `hello2`, and so on
2. Style each group to reset opacity and assign an animation
3. Define one `@keyframes` entry for each frame with two keyframes, the first always setting opacity to `1` and the second always setting it to `0`
4. To calculate the percentage to "step" the animation by, divide `100%` by the number of frames. Use the resulting step size to increment the percentages for successive `@keyframes` entries

The Beavis and Butthead animation is `1.3` seconds long and has `10` frames (each frame steps by `10%` since `100% / 10 = 10%`):

```
const BeavisAndButthead = styled(BeavisAndButtheadIllustration)`
  #chortle1 {
    opacity: 0;
    animation: chort1 1.3s steps(1) infinite;
  }

  #chortle2 {
    opacity: 0;
    animation: chort2 1.3s steps(1) infinite;
  }

  #chortle3 {
    opacity: 0;
    animation: chort3 1.3s steps(1) infinite;
  }

  #chortle4 {
    opacity: 0;
    animation: chort4 1.3s steps(1) infinite;
  }

  #chortle5 {
    opacity: 0;
    animation: chort5 1.3s steps(1) infinite;
  }

  #chortle6 {
    opacity: 0;
    animation: chort6 1.3s steps(1) infinite;
  }

  #chortle7 {
    opacity: 0;
    animation: chort7 1.3s steps(1) infinite;
  }

  #chortle8 {
    opacity: 0;
    animation: chort8 1.3s steps(1) infinite;
  }

  #chortle9 {
    opacity: 0;
    animation: chort9 1.3s steps(1) infinite;
  }

  #chortle10 {
    opacity: 0;
    animation: chort10 1.3s steps(1) infinite;
  }

  @keyframes chort1 {
    0% {
      opacity: 1;
    }
    10% {
      opacity: 0;
    }
  }

  @keyframes chort2 {
    10% {
      opacity: 1;
    }
    20% {
      opacity: 0;
    }
  }

  @keyframes chort3 {
    20% {
      opacity: 1;
    }
    30% {
      opacity: 0;
    }
  }

  @keyframes chort4 {
    30% {
      opacity: 1;
    }
    40% {
      opacity: 0;
    }
  }

  @keyframes chort5 {
    40% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes chort6 {
    50% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
  }

  @keyframes chort7 {
    60% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
  }

  @keyframes chort8 {
    70% {
      opacity: 1;
    }
    80% {
      opacity: 0;
    }
  }

  @keyframes chort9 {
    80% {
      opacity: 1;
    }
    90% {
      opacity: 0;
    }
  }

  @keyframes chort10 {
    90% {
      opacity: 1;
    }
  }
`;
```

The last example in this section is the kitty-cat clock from Back to the Future that combines looping frame-by-frame animation with data-driven animation:

<ClockExample />

In order to have the eyes and the tail loop back-and-forth, the `alternate` keyword was added to the style for each frame:

```
...
#tail {
  animation: tailframes 0.7s linear infinite alternate;
}
#eyes1 {
  opacity: 0;
  animation: eyeframes1 0.7s steps(1) infinite alternate;
}
...
```

## frame controller

The last example demonstrates how to play specific frames of a frame-by-frame animation based on changing state:

<ControlledExample />

This is simpler than a looping animation because all that's needed is a style for each frame that switches opacity based on state:

```
const FRAMES = 14;

const showFrame = (pos: number, frame: number) =>
  Math.round(pos * FRAMES) === frame ? 1 : 0;

const Cube: FC<{
  position: number;
}> = ({ position }) => (
  <svg width="128" viewBox="0 0 32 32">
    <g id="frame1" style={{ opacity: showFrame(position, 0) }}>
     ...
    </g>
    <g id="frame2" style={{ opacity: showFrame(position, 1) }}>
     ...
    </g>
    <g id="frame3" style={{ opacity: showFrame(position, 2) }}>
      ...
    </g>
    ...
```