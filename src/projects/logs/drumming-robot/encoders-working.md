---
title: Encoders working
description: Got chained ADS1115 encoders reading analog signals
image: ../../images/drumming-robot.png
date: 2021-04-15
author: Valeriy Novytskyy
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-mechanical',
    'design-industrial',
  ]
---

I finally got chained ADS1115 encoders working to read arm bone positions. It was really confusing because the manual lists configuration setting bit offsets in low-endian, but the chip then accepts the resulting bytes in high-endian (two's complement encoded) order: https://github.com/01binary/drummingrobot/blob/master/src/code/ads1115.cpp

Everything I had to go through is documented in [Absolute Encoder Review](../../../articles/absolute-encoder-review.md) including stand-alone source code that can be pasted into your project.

![Encoders Working 1](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/encoders-working1.png)

![Encoders Working 2](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/encoders-working2.png)

![Encoders Working 3](https://zeroweb-downloads.s3.us-west-2.amazonaws.com/encoders-working3.png)
