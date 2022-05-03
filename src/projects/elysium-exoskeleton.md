---
title: Elysium Exoskeleton
description: A full-scale replica of the exosuit from the movie Elysium (2013)
image: ./images/elysium-exoskeleton.png
author: Valeriy Novytskyy
date: 2021-02-11
location: ^H Hackerspace
tags: ['engineering-mechanical', 'design-industrial', 'tool-inventor']
---

import Gallery from '../components/Gallery';

## overview

This exosuit was designed in [Autodesk Inventor](https://www.autodesk.com/products/inventor/overview) using photographs of the movie props built by [Weta Workshop](https://wetaworkshopdesignstudio.artstation.com/) (original concept art drawn by [Aaron Beck](http://skul4aface.blogspot.com/)).

`youtube:https://www.youtube.com/embed/J7dyjE7jP0k`

Some parts were 3D-printed with [Protolabs](https://www.protolabs.com/) and re-cast out of Alumimum 356 at [Ctrl^H](https://pdxhackerspace.org/) foundry, others machined by Protolabs out of Aluminum 6061. The pistons were machined on a metal lathe, and then the exosuit was assembled by using [metal rod ends](https://www.mcmaster.com/rod-ends/ball-joint-rod-ends-10/shank-thread-size~m6/) from McMaster Carr and fasteners from Fastenall.

<Gallery>
  <img alt="back" src="./images/elysium-exoskeleton-worn-back.jpg"/>
  <img alt="side" src="./images/elysium-exoskeleton-worn-side.jpg"/>
  <img alt="front" src="./images/elysium-exoskeleton-worn-front.jpg"/>
  <img alt="parts" src="./images/elysium-exoskeleton-assembly1.jpg"/>
  <img alt="print" src="./images/elysium-exoskeleton-print-parts.png"/>
  <img alt="test" src="./images/elysium-exoskeleton-print.jpg"/>
  <img alt="proto" src="./images/elysium-exoskeleton-print-assemble.jpg"/>
  <img alt="pistons" src="./images/elysium-exoskeleton-pistons.jpg"/>
</Gallery>

Completing this project presented significant challenges, but members of [The Home Foundry](http://forums.thehomefoundry.org/index.php?threads/help-me-make-another-attempt-at-shell-casting.373) forum helped me learn investment casting and [Panurgic](https://yellow.place/es/panurgic-portland-usa) jewelry shop taught small-scale autoclaving. Everything I learned is [documented](https://github.com/01binary/investment-casting) and the foundry I setup for this project is available to [Ctrl^H hackerspace](https://pdxhackerspace.org/) members.

<Gallery>
  <img alt="print" src="./images/elysium-exoskeleton-moldmaking.jpg"/>
  <img alt="mold" src="./images/elysium-exoskeleton-chest-mold.jpg"/>
  <img alt="shells" src="./images/elysium-exoskeleton-shells.jpg"/>
  <img alt="bake" src="./images/elysium-exoskeleton-chest-bake.jpg" />
  <img alt="cast" src="./images/elysium-exoskeleton-chest-cast.jpg" />
  <img alt="chase" src="./images/elysium-exoskeleton-finishing.jpg" />
  <img alt="paint" src="./images/elysium-exoskeleton-chest-finished.png" />
  <img alt="assemble" src="./images/elysium-exoskeleton-assembly2.jpg" />
</Gallery>

Once the metal parts were filed and polished, [meowterspace](https://github.com/infinesse) helped spray-paint them with glossy black enamel from Tamiya and Rust-oleum.

`youtube:https://www.youtube.com/embed/3MetNmw2rHo`

## instructions

Assembly instructions created for the [Hackaday 2017 Sci-Fi Contest](https://hackaday.io/contest/19541-hackadays-2017-sci-fi-contest):

- [Assembly Instructions (Light)](exoskeleton-instructions-light.pdf)
- [Assembly Instructions (Dark)](exoskeleton-instructions-dark.pdf)

![3d rendering](./images/elysium-exoskeleton-3d.png)

## downloads

Parts can be downloaded by cloning the [GitHub repository](https://github.com/01binary/elysium-max-exoskeleton) and are also [viewable in the browser](https://github.com/01binary/elysium-max-exoskeleton/blob/master/print/HipRight.stl), so you can use the instructions above to make one!

| directory                                                                                    | contents                                                      |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [print](https://github.com/01binary/elysium-max-exoskeleton/tree/master/print)               | .stl exports of individual parts using millimiter units       |
| [instructions](https://github.com/01binary/elysium-max-exoskeleton/tree/master/instructions) | build instructions and the source Adobe InDesign file         |
| [build](https://github.com/01binary/elysium-max-exoskeleton/tree/master/build)               | photographs to show assembled parts at a glance               |
| [assembled](https://github.com/01binary/elysium-max-exoskeleton/tree/master/assembled)       | high-poly .stl and .obj exports of the assembled exosuit      |
| [src](https://github.com/01binary/elysium-max-exoskeleton/tree/master/src)                   | Autodesk Inventor parts (.ipt) and assemblies (.iam)          |
| [render](https://github.com/01binary/elysium-max-exoskeleton/tree/master/render)             | 3D renders to show assembled parts at a glance                |
| [view](https://github.com/01binary/elysium-max-exoskeleton/tree/master/view)                 | low-poly .obj export with ambient occlusion texture           |
| [references](https://github.com/01binary/elysium-max-exoskeleton/tree/master/references)     | reference photographs used to model all parts in this project |

## build

Here's what metal casting the chest plate of this suit looked like:

`youtube:https://www.youtube.com/embed/OFgFWeI5fzA`

The entire process of building this exosuit is summarized in this presentation:

[![presentation](./images/exoskeleton-presentation.png)](https://docs.google.com/presentation/d/19_l0XWe4A3Xc64K67Ak3zYep9TedVx4DBbwqQECWMyE/edit?usp=sharing)

See the [Hackaday project](https://hackaday.io/project/19830-elysium-max-exoskeleton/) and the [RPF build log](http://www.therpf.com/showthread.php?t=212832) for a journal of this build.
