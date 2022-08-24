---
title: Torso Rotation
description: Rotating the upper half of the robot
image: ../../images/drumming-robot.png
date: 2020-05-14
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

I got the shocks and drive links ordered, modeled, and installed in the virtual assembly.

![Torso rotation](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/torso-rotation1.png)

Next I am shopping for a hollow rotary reducer platform that will rotate the torso. Something like this:

![Torso rotation 2](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/torso-rotation2.jpeg)

Most DC motors that work well for robotics applications have lower torque and aren't designed to withstand a significant off-axis force (i.e. torso trying to fall over and rip the motor flange out of the motor).

Planetary gear reducers solve this problem because they have bearings to counteract off-axis force, and between 5:1 and 10:1 ratio that makes it possible to use a low power motor to turn a great deal of mass.

Unfortunately the American-made rotary reducers are around $4000, and buying a Chinese one for $400 is pretty scary because there is no guarantee that it will ever be shipped, will work, or will arrive this year. Let's see what happens!
