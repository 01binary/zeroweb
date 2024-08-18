---
title: PID Motor Control
description: Designing a PID controller for closed loop control of a DC motor
image: ./images/kalman-filter2.png
author: Valeriy Novytskyy
date: 2024-08-20
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-software',
    'tool-matlab',
    'tool-cpp'
  ]
---

## overview

Building large robots requires *high-torque* servomotors which are [expensive](https://www.cubemars.com/goods-1143-AK80-64.html) or hard to find. While a single servo may be affordable, consider that most biped and quadruped robots need at least `8` of them.

Robotics researchers build their own servos by controlling DC motors in a closed loop as in the case of the [PR2](https://robotsguide.com/robots/pr2) robot with [Maxon](https://www.maxongroup.com/maxon/view/product/motor/dcmotor/re/re40/148866) motors, or design their own motors *and controllers* as in the case of [MIT Mini Cheetah](https://robotsguide.com/robots/minicheetah) and [Cassie](https://robotsguide.com/robots/cassie).

In this article we'll explore how to build a servo using any motor and encoder.

## closed loop

*Closed loop* control means that you are measuring what the device you are controlling is doing, and adjusting the input commands sent to the device based on these measurements.

Controlling DC motors in a closed loop requires attaching a relative and/or absolute encoder to the motor shaft or inside the joints controlled by the motor.

In contrast, *open loop* control may involve treating the position of the motor shaft or the joint as a function of time since the voltage was first applied since the speed of the motor is known.

## pid control

The most popular way to achieve closed loop control of a DC motor is by using a real-time *PID controller* configured with three *gain* coefficients that give it that name: *Proportional*, *Integral*, and *Derivative*.

The **Proportional gain** specifies how much effort to *apply* in response to a position *error* (the difference between current and desired position). This can be thought of as a "stiffness" coefficient that simulates a rubber band.

The **Integral gain** specifes how much effort to *add* when the error does not decrease quickly enough (i.e. this is based on the *past* history). This coefficient is applied to the sum of the error that keeps accumulating over time.

The **Derivative gain** specifies how much effort to *subtract* based on a *future* prediction of what will happen to the motor. This can be thought of as a *damping* coefficient used to prevent *oscillation* when the motor shaft reaches the target position, overshoots, then overshoots again while correcting.

This coefficient is applied to the continuously updated slope of the curve representing the motion of the motor, which is how it's able to predict that a motor will overshoot the desired position reduce the effort before it happens.

## tuning controllers

The PID gains can be tuned by hand, simply by trying different values to find a combination that satisfies a given application. This is both time consuming and stressful to the motor, as small changes can result in violent oscillation at the maximum motor velocity.

A more scientific way of doing this is to *characterize* a DC motor by using a *System Identification* process to model it mathematically, and then use the model to determine the PID gains that will achieve a *response* somewhere between "fast and careless" and "slow and deliberate".

Characterizing a motor requires running it at different velocities and recording the results, then using the [System Identification]() app in [Matlab Control Toolbox](https://www.mathworks.com/products/control.html) to determine the optimal coefficients for a Linear Model or a Transfer Function that describes how the motor behaves.

Tuning a PID controller can be done virtually by using the [PID Tuner]() app where you can adjust stiffness and damping parameters and watch what would happen to the motor position graphed over time.

This article will demonstrate how to capture data from the motor, use it to model the motor behavior, use the model to tune PID gains, and write a real-time PID controller that works with the Robot Operating System (ROS).

## system identification

### linear model

### transfer function

## pid tuner

## stock controller

## custom controller

## real-time control

## demo