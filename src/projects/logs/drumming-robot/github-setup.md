---
title: GitHub project setup
description: Posting the code and starting project management
image: ../../images/drumming-robot.png
date: 2020-05-13
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

This week I setup project management Kanban board on GitHub:

https://github.com/01binary/drummingrobot/projects/1

Last sprint I had a lot of trouble finding shock absorbers for the arms and the torso. Today I finally found RC car drive links that I can use for the arms instead of shocks, and small motorcycle shocks that I can use for the torso.

Drive links: https://www.amazon.com/Integy-Hop-ups-C27173SILVER-Machined-Suspension/dp/B076F3YCY9

Shocks: https://www.ebay.com/i/273547931664

Another task that I had trouble with for a while is sourcing a DC motor responsible for turning the torso. I looked at ClearPath motors but they are not powerful enough. Since I would like to run the robot on batteries, AC motors are not a good option. It's likely that I will need planetary gear rotating platform or something else that will let me use multiple weaker DC motors to turn the torso.

The servos responsible for rotating arms are over $1000 each (Dynamixel Pro) so I would rather not get a $4000 motor for the torso in addition to that - too wasteful on the resources since torso motion is not critical to this design.
