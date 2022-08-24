---
title: Planetary gear drive working
description: Actuating robot torso rotation
image: ../../images/drumming-robot.png
date: 2020-10-21
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

My next goal was learning to control the planetary gear drive with a ClearPath servo hooked up. I got it working this week - using the Velocity Command mode with PWM. The control pinout is Enable, Stop, Velocity, and Velocity Feedback. 

If you set Enable HIGH, Stop LOW, then PWM Velocity is < 50% duty cycle reverse and >= 50% duty cycle forward. You set the duty cycle constant by connecting that servo to USB and launching a Windows application that configures it. In this case I set 100 Hz as 100% duty cycle, so 50 Hz is half. On Raspberri Pi, I am using pigpio do send PWM with 255 passed for duty cycle to go forward max speed.

`youtube:https://www.youtube.com/embed/GiVNgLYOnpI`
