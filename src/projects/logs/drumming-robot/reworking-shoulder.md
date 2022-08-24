---
title: Re-working the shoulder
description: Re-design for new cheap but powerful motor
image: ../../images/drumming-robot.png
date: 2021-02-01
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

Last week I made a decision to use a new shoulder motor, so I had to re-design the shoulder to put the motor sideways:

![Reworking the shoulder 1](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/rework-shoulder1.jpeg)

![Reworking the shoulder 2](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/rework-shoulder2.png)

![Reworking the shoulder 3](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/rework-shoulder3.png)

This week I added source code to read a hollow shaft potentiometer while rotating the motor so that I could stop using an inaccurate metric of PWM "time" to guess the position of the arm, and the performance has been less than acceptable. I already spent two weeks looking for an absolute encoder to read servo positions and this one was the best I could find:

![Encoder from P3 America](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/rework-shoulder-p3.png)

So now, it looks like I'm forced by build my own encoders. All others are either giant and bulky, or have really difficult legacy programming interface.
I settled on AS5045, so I will have to design my own board for this chip in Eagle Cad (after I learn Eagle Cad) and manufacture my own housing that's really compact and easy to fit anywhere.

![Alternative AS5045 encoder](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/rework-shoulder-as5045.png)
