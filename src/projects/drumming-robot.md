---
title: Str1ker
description: A four-armed robotic drummer with stereoscopic infrared vision
image: ./images/drumming-robot.png
author: Valeriy Novytskyy
date: 2019-08-10
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-electrical',
    'engineering-mechanical',
    'engineering-software',
    'design-industrial',
    'tool-raspi',
    'tool-inventor',
  ]
---

import Gallery from '../components/Gallery';

## overview

Str1ker is a robotic drummer built with a combination of metal casting, 3D printing, CNC machining, sheet metal fabrication and pre-made components. Performance, movement, and facial expressions are controlled by MIDI, and the position of each drum is determined by using a night-vision stereo camera.

![str1ker logo](./images/drumming-robot-logo.png)

For this project my goal is to learn [::ROS](https://www.ros.org/), create parts that look organic by using Generative Design functionality in [Autodesk Inventor](https://www.autodesk.com/products/inventor/), get experience with [Raspberry Pi 4](https://www.adafruit.com/product/4296) micro-controller, modern servos and linear actuators, and finally build a robotic drummer for my [neurometal](https://www.youtube.com/playlist?list=PL2ZwTvIdYJGJxl1kszP3a_z6O4DcHwvok) band.

<Gallery>
  <img alt="body" src="./images/drumming-robot-body.png"/>
  <img alt="arms" src="./images/drumming-robot-arms.png"/>
  <img alt="wiring" src="./images/drumming-robot-wiring.jpg"/>
  <img alt="still" src="./images/drumming-robot-still-life.png"/>
</Gallery>

## prototype

I started by prototyping a single arm out of wood to get it rotating, raising, extending, and triggering a drum stick using a solenoid on a spring:

`youtube:https://www.youtube.com/embed/Abf0k5A4z88`

Once the design for the robot arms was finalized, I printed and [re-cast](https://github.com/01binary/investment-casting) them out of Aluminum 356, then installed encoders and actuators. I also designed a head that could make facial expressions and voice [hypergrowls](https://www.youtube.com/watch?v=Stvc9zR3-KA).

<Gallery>
  <img alt="arm" src="./images/drumming-robot-arm.png"/>
  <img alt="sensor" src="./images/drumming-robot-arm-sensors.jpg"/>
  <img alt="machine" src="./images/drumming-robot-arm-tool.jpg"/>
  <img alt="assembly" src="./images/drumming-robot-arm-assembly.jpg"/>
  <img alt="code" src="./images/drumming-robot-encoder.jpg"/>
  <img alt="side" src="./images/drumming-robot-face-side.png"/>
  <img alt="front" src="./images/drumming-robot-face-front.png"/>
  <img alt="eyes" src="./images/drumming-robot-head-model.jpg"/>
</Gallery>

Next I'm integration testing all four arms together, implementing inverse kinematics with [MoveIt](https://moveit.ros.org/), and locating drums using OpenCV with [Arducam](https://www.arducam.com/) NoIR stereo camera that can estimate positions of objects in the dark.

## downloads

The project files can be downloaded by cloning the [GitHub repository](https://github.com/01binary/drummingrobot).

| content                           | location                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Mechanical parts                  | [parts](https://github.com/01binary/drummingrobot/tree/master/src/parts)       |
| Source code                       | [code](https://github.com/01binary/drummingrobot/tree/master/src/code)         |
| Concept art                       | [design](https://github.com/01binary/drummingrobot/tree/master/design)         |
| Documentation for components used | [doc](https://github.com/01binary/drummingrobot/tree/master/doc)               |
| Inspiration                       | [references](https://github.com/01binary/drummingrobot/tree/master/references) |
| 3D renders                        | [render](https://github.com/01binary/drummingrobot/tree/master/render)         |

![str1ker head](./images/drumming-robot-head.png)
