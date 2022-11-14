---
title: New rotation motor; source on GitHub
description: Sourced a cheap but powerful motor, put code on GitHub
image: ../../images/drumming-robot.png
date: 2021-01-26
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

Over the past few weeks I found another, cheaper servo that's still strong enough to rotate the arm:

![New Motor from GoBilda](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/newmotor-1.png)

https://www.gobilda.com/5202-series-yellow-jacket-planetary-gear-motor-188-1-ratio-30-rpm-3-3-5v-encoder/

It has a built-in encoder, 100N of force, and basically works the same in this particular application, except that it's $40 rather than $1300. I really thought the Dynamixel servo would be easier to use and work best for this application, but it ended up being an overkill. I will save that when it comes time to work on walking machines, and perfect response & feedback times really matter.

![New Motor Installed](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/newmotor-2.png)

A few other changes - I got a 5V power supply for Raspberri Pi and connected it with a 5-terminal-to-USB-C cable:

https://www.newark.com/mean-well/rsd-30g-5/dc-dc-converter-5v-6a/dp/44AC7344?CMP=e-email-sys-orderack-GLB

I also ordered a 1000W power supply that should have enough juice to power the whole robot:

![1000 Watt Power Supply](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/power-supply-1000.png)

https://power.sager.com/hrpg-1000-12-5357680.htm

...and finally, I put all the source code I have so far on GitHub along side the 3D parts.

https://github.com/01binary/drummingrobot

If you haven't tried the new "sparse checkout" future in git (requires latest version) - this lets you track changes and pull only a portion of the whole repository. I built git from source on Raspberri Pi to get the new feature, and it works great. I checked out only the C++ source for the robot and left the large 3D part files on the machine I use for CAD.

```
git sparse-checkout init --cone
git sparse-checkout set build launch src/code
```

In the source, I recently implemented a system that loads joint controllers from Robot Operating System launch parameters (basically a block of YAML inside of XML launch file) and it supports all of the actuators I worked with so far.

It creates each controller dynamically from a simple dependency injection container by type name, and supports full paths (like robot/arm1/forearm/).


![Str1ker Console](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/striker-console.png)

This is a shot of it running with everything except the arm rotation servo disabled, because I was testing out that new servo. If in the future I substitute the servo with another one that uses serial protocol I just have to code the new servo and specify a different type name for the "shoulder" actuator to load that new type. The interface is the same for all servos, regardless of how they are controlled and how they track their current position.

For simple PWM servos like those linear actuators, I am going to need to code a feedback system by using hollow shaft potentiometers all coming into the same DAC chip.