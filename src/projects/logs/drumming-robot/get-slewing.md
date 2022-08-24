---
title: Stop screwing, get Slewing!
description: Investigating slewing drive for torso rotation
image: ../../images/drumming-robot.png
date: 2020-05-15
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

Slewing Drives are a lower-cost alternative to robot rotary platforms that trades precision for cost while still being able to support a lot of weight.

![Slewing drive order](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/slewing-order1.png)

That is, it's a composite solution:

* The slewing drive that can take a 100 lb off-axis load, with a high gear ratio, but not too wide in diameter as to be excessively huge or heavy. It uses a worm gear.
* An extra gear box to up the gear ratio even further
* A beefy ClearPath motor popular in robotics

The company that manufactures it is called Cone Drive. The STEP file couldn't download so I am modeling it off 2D drawings to plug it into the virtual assembly.
