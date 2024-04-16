---
title: Kalman Filter
description: Design and practical applications of Kalman filter
image: ./images/inverse-kinematics.png
author: Valeriy Novytskyy
date: 2024-04-29
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'engineering-software',
    'tool-cpp'
  ]
---

TODO need "tool-matlab"

## overview

The Kalman filter is popular because it can generate accurate estimates in the presence of uncertainty and measurement noise. Simpler techniques like moving average or low pass filters introduce delay or miss important events, which is unacceptable for dynamic systems like cars and robots.

## background

In this article I introduce the Kalman Filter in the shortest way possible with practical examples. When you're ready to go deeper checkout *Kalman Filter from the Ground Up by Alex Becker* at [kalmanfilter.net](https://www.kalmanfilter.net/default.aspx):

![kalman filter from the ground up](./images/kalman-background.png)

In essence, we are going to attempt something that requires calculus, differential equations, and statistics, but *without* studying these subjects first.

Seeing these concepts put to practical use may change your perspective and let you appreciate them in a whole new light!

## why not average?

A basic *moving average* filter can be implemented as follows:

```matlab
% Initial guess
estimate = getMeasurement()

% How many samples filtered so far
k = 0

while running
  % Take measurement
  measurement = getMeasurement()

  % Increment counter
  k = k + 1

  % Blend measurement with previous estimate
  estimate =
    ((k - 1.0) / k) * estimate +
    (1.0 / k) * measurement
end
```

Compare the filter result to the original noisy data set:

> Moving average illustration

Notice that filtered data has been shifted on the time axis, introducing delay:

+ In the case of DC motor control for robotics, a simple average filter would cause the [PID](https://www.ni.com/en/shop/labview/pid-theory-explained.html) algorithm to oscillate, as it would see this delay as a signal that it's not working hard enough, and over-compensate. 
+ In the case of a moving vehicle, a simple average would cause the estimated position to lag too far behind, causing the navigation system to suggest changes to the route too late for the driver to respond.

## why not low pass?

A basic *low-pass* filter can be implemented as follows:

```matlab
% Initial guess
estimate = getMeasurement()

% Low-pass filter coefficient
coefficient = 0.1

while running
  % Take measurement
  measurement = getMeasurement()

  % Blend measurement with previous estimate
  estimate =
    (1.0 - coefficient) * estimate +
    coefficient * measurement
end
```

Compare the filter result to the original noisy data set:

> Low pass illustration

The filter completely missed the short temporal spike in the data. This may be fine if the system is cyclical in nature (*a stopped clock is right twice a day!*) but if the subsequent state depends on previous system state, missing important events would cause it to diverge far from reality.

## why predict?

If you know what a moving vehicle or a motor shaft are supposed to do (*since you are controlling them in the first place*), why should you let measurements have so much influence on where they are estimated to be next?

In the case of a DC motor, the PWM command determines velocity, which can be used to determine the shaft position:

```matlab
% System Identification (5202 Series Yellow Jacket Motor)
MAX_PWM = 65536
MAX_VELOCITY_RPM = 30
MAX_VELOCITY = MAX_VELOCITY_RPM * PI * 2 / 60

% System State
position = 0

% System Model
function position = systemModel(input, timeStep)
  % Map PWM to velocity
  velocity = input / MAX_PWM * MAX_VELOCITY

  % Predict position
  position = position + velocity * timeStep
end
```

In the case of a moving vehicle, the pressure on the gas pedal can determine acceleration, which then determines velocity and position:

```matlab
% System Identification (Chevrolet Trax 2017 4WD)
MAX_ACCELERATION = 2.82
DRAG_COEFFICIENT = 0.35
FRONTAL_AREA = 2.5
AIR_DENSITY = 1.225
WHEEL_RADIUS = 696 / 2
FRICTION_COEFFICIENT = 0.9
WEIGHT = 1488
G = 6.6743

% System State
velocity = 0
position = 0

% System Model
function position = systemModel(input, timeStep)
  % Map pressure on gas pedal to acceleration
  acceleration = input * MAX_ACCELERATION

  % Subtract drag force
  drag = DRAG_COEFFICIENT / 2.0 *
    AIR_DENSITY * FRONTAL_AREA * velocity^2
  acceleration = acceleration - drag

  % Subtract friction force
  friction = FRICTION_COEFFICIENT * WEIGHT * G / WHEEL_RADIUS * 4
  acceleration = acceleration - friction

  % Predict velocity
  velocity = velocity + acceleration * timeStep

  % Predict position
  position = position + velocity * timeStep
end
```

This is the first special thing about the Kalman filter: it blends *measurements* with *predictions* by using a *weight* which is tuned at each iteration to maximize the accuracy of the estimate:

```matlab
% Initial guess
prediction = initialGuess

while running
  % Take measurement
  measurement = getMeasurement()

  % Determine the weight that maximizes accuracy
  weight = optimizeEstimate()

  % Blend prediction with measurement using this weight
  estimate = prediction * weight + ((1 - weight) * measurement)

  % Predict next state by using a mathematical model
  prediction = systemModel(input)
end
```

We will examine each of these steps in detail in the following sections.

## variance

The second special thing about the Kalman filter is that its output isn't simply a value but a *probability distribution* (the likelihood of it being a certain value).

+ A probability distribution is a mean of a set of numbers and its spread from that mean (called *variance*).
+ A *mean* is the sum of a set of numbers divided by the size of the set.

> illustration: value vs probability distribution of this value

To calculate variance from a set of samples:

1. Calculate the mean
2. For each number in the set, calculate distance from the mean (subtract mean from the number)
3. Square each distance from the mean, which will give you variance for this item in the set
4. Calculate the mean of all variances in the set (variances summed over number of items). This will give you the variance of the set.

In [Matlab](https://www.mathworks.com/products/matlab.html) or [Octave](https://octave.org/), mean and variance can be calculated as follows:

```matlab
set = [1, 2, 3, 4, 5]

>> mean(set)

ans =

   3

>> var(set)

ans =

   2.5000
```

## kalman filter

The Kalman filter starts with an initial guess. The weight of measurements decreases exponentially as the system state is synchronized with reality.

```matlab
% Initial guess
prediction = initialGuess
estimateVariance = initialGuessVariance

while running
  % Take measurement
  measurement = getMeasurement()
  measurementVariance = getMeasurementVariance(conditions)

  % Optimize
  gain = estimateVariance /
    (estimateVariance + measurementVariance)

  % Estimate
  estimate = prediction + gain * (measurement - prediction)
  estimateVariance = (1 - gain) * estimateVariance

  % Predict
  prediction = systemModel(input)
  estimateVariance = systemModelVariance(estimateVariance)
end
```

## initial guess

Initial guess can be an initial measurement, or the output of the system model with initial state. The initial guess does not have to be accurate.

```matlab
prediction = initialGuess
estimateVariance = initialGuessVariance
```

The initial variance depends on where the initial guess came from.
+ If the initial guess was from a measurement, use the variance of the measurement device. See [variance](#variance) section above for determining how to calculate variance by taking samples from your device.
+ If the initial guess was from a system model, use the variance of the model. We will go over identifying system models with Matlab in [system identification](#system-identification) and estimating variance in [estimating variance](#estimating-variance).

## measurement

Next we start taking measurements:

```matlab
measurement = getMeasurement()
measurementVariance = getMeasurementVariance(conditions)
```

Measurement variance could be constant or vary based on conditions.

+ If you are using a hall effect encoder that provides less accurate readings if the magnet is off-center, you could use the alignment error to adjust the measurement variance (encoders like [AKSIM](https://www.rls.si/eng/aksim-off-axis-rotary-absolute-encoder) tell you the alignment error).
+ Complex measurement devices like radar let you estimate the dynamic effects of wind and rain on their signal-to-noise ratio to derive measurement variance.
+ A basic potentiometer can be sampled in a range of expected conditions to calculate a constant variance (see [variance](#variance)).

## optimization

The Kalman gain is adjusted at each iteration to optimize the estimate:

```matlab
gain = estimateVariance /
  (estimateVariance + measurementVariance)
```

## estimate

Prediction is blended with measurement to get an optimal estimate:

```matlab
estimate = prediction + gain * (measurement - prediction)
```

Estimate variance decreases as the Kalman gain increases, indicating that the estimate is becoming more accurate:

```matlab
estimateVariance = (1 - gain) * estimateVariance
```

## prediction

The prediction is updated based on the system model as discussed earlier:

```matlab
prediction = systemModel(input, timeStep)
```

## system identification

You can come up with the system model by analyzing the system (as we did in the overly simplified examples of a vehicle and PWM-controlled motor in [why predict?](#why-predict) section earlier), or by using [system identification](https://www.mathworks.com/products/sysid.html).

A system identification algorithm tries to guess the system model given system input and output tracked over time.

In the following video we'll look at identifying a system by using a [linear state-space model](https://www.mathworks.com/help/control/ref/ss.html) in Matlab because it's simple and provides great estimates:

> You could write a Python script to identify a system without using Matlab, but that's a [complex topic](https://github.com/adamb314/ServoProject/blob/main/Doc/Theory.md#system-identification) on its own. Matlab trial lasts 30 days which is enough time to [identify a system](https://www.mathworks.com/help/ident/gs/identify-linear-models-using-the-gui.html) with the *System Identification Toolbox*. The [Home Perpetual License](https://www.mathworks.com/pricing-licensing.html?prodcode=ML&intendeduse=home) is affordable for non-commercial use.

A linear state space model is described by two equations, one that updates the output, and one that updates the rate of change of the output:

```matlab
y(t) = Cx(t) + Du(t) + e(t)
dx/dt = Ax(t) + Bu(t) + Ke(t)
```

The model *order* refers to the number of state variables needed to describe the system. Terms that are vectors will have the *order* number of elements and terms that are matrices will be *order* x *order*:

+ `y` is system output (scalar)
+ `x` is system state that causes the output (vector)
+ `C` is the weight of system state (vector)
+ `D` is the weight of input (scalar)
+ `A` is the weight of system state derivative (matrix)
+ `B` is the weight of input derivative (vector)
+ `K` is the weight of noise or disturbance derivative (vector)
+ `t` is the time interval (scalar)
+ `u` is system input (scalar)
+ `e` is noise or disturbance

*Identifying* a system refers to finding `A`, `B`, `C`, `D`, `K` weights that make the output of these two equations most closely resemble the measured output.

After identifying the system you can extract the following by using [idssdata](https://www.mathworks.com/help/ident/ref/idss.idssdata.html):

```matlab
[A,B,C,D,K,x0,dA,dB,dC,dD,dx0] = idssdata(sys);
```

* `A`, `B`, `C`, `D`, `K` are the weights described above
* `dA`, `dB`, `dC`, and `dD` are the variances of system state and inputs
* `x0` is initial state (plug this into the equations to get the initial guess)
* `dx0` is the variance of the initial state

Implementing the system model in C++ might look like the following:

```cpp
// Example of 3rd order linear system model
#include <Eigen/Dense>

using namespace Eigen;

// A weights (3x3 matrix)
const MatrixXd A
{
  { -0.1199, 2.0558, 1.1026 },
  { -1.8226, -0.7465, -15.0483 },
  { 0.7375,  8.2928,  -16.6951 }
};

// B weights (3x1 vector)
const RowVectorXd B {{ 0.0009, 0.1359, 0.3223 }};

// C weights (1x3 vector)
const VectorXd C {{ -32.1738, -0.7282, 0.1308 }};

// D weight (scalar)
const double D = 8.7666e-04;

// K weights (3x1 vector)
const RowVectorXd K {{ -1.3722, -4.1560, 12.5563 }};

// Cx + Du + e
double systemPositionModel(
  const RowVectorXd& x, double u, double e)
{
  return
    // Add contribution of state
    C * x +
    // Add contribution of input
    D * u +
    // Add disturbance
    e;
}

// Ax + Bu + Ke
double systemVelocityModel(
  const RowVectorXd& x, double u, double e)
{
  RowVectorXd dxdt =
    // Add contribution of state
    A * x +
    // Add contribution of input
    B * u +
    // Add contribution of disturbance
    K * e;

  // Sum contributions
  return dxdt.block(0, 0, B.rows(), B.cols()).sum();
}
```

The `e` input term is the disturbance or noise to apply at each time step. Its meaning depends on the model:

+ When controlling a DC motor it could be *lag* due to a loose gearbox or *shock* from quickly reversing direction (the weight attached to the motor shaft is moving the opposite way when the shaft reverses direction).
+ When estimating the position of a vehicle it could be wind, road quality, or driver maneuvers like steering and braking.
+ If you don't have a way to derive disturbance, uncheck *Include disturbance component* when identifying the system and omit this term.
+ If you don't know the disturbance but know its mean and variance from sampling the real system, you could also *simulate* the disturbance.

To simulating disturbance by adding normally distributed noise:

```cpp
// A function that simulates disturbance ("e" term)
#include <random>

using namespace std;

double generateDisturbance(double mean, double variance)
{
  // Set up a random device and a normal distribution
  random_device rd;
  mt19937 gen(rd());
  normal_distribution<double> dist(mean, sqrt(variance));

  // Generate a sample from the distribution
  return dist(gen);
}
```

For more background on system identification and control, see the [series of tutorials](https://ctms.engin.umich.edu/CTMS/index.php?aux=Home) assembled by two professors at Carnegie Mellon university.

## estimating variance

To update the estimate variance, you have to use the same equation(s) describing your system model. However, since variance is not a number but a function of a set of numbers, it follows [variance algebra for random variables](https://en.wikipedia.org/wiki/Algebra_of_random_variables#:~:text=the%20product%20of%20two%20random,if%20X%20is%20a%20constant.).

> For example, to multiply a variance by a constant you have to [square the constant](https://flexbooks.ck12.org/cbook/ck-12-probability-and-statistics-concepts/section/7.10/primary/lesson/transforming-random-variables-ii-pst/). This is because variance is calculated for every item in a set, so you are in effect multiplying the entire set by that constant.

In the remainder of this section we will look at examples on how to update the estimate variance for various system models explored in this article.

### constant velocity

If the system is described by constant velocity (i.e. velocity is an input):

```matlab
velocity = getVelocity()
estimate = estimate + velocity * timeStep
```

Then the estimate variance can be updated like this:

```matlab
velocityVariance = getVelocityVariance()

estimateVariance = estimateVariance
  + velocityVariance * timeStep^2
```

The velocity variance depends on where the velocity input came from:

+ If it's from twisting a potentiometer knob, you would start with the variance of the potentiometer signal (calculated from a set of samples of this signal), then put it through the equation that maps potentiometer position to PWM command using random variable arithmetic.
+ If it's calculated by a PID control algorithm based on an absolute encoder and a set-point you would start with the variance of the encoder and the set-point, and put it through the same equation as the PID algorithm using random variable arithmetic.

As you can see variance simply travels downstream.

### velocity/acceleration

If the system is described by velocity and acceleration:

```matlab
acceleration = getAcceleration()
estimate = estimate + velocity * timeStep
velocity = velocity + acceleration * timeStep
```

Then the estimate variance can be updated like this:

```matlab
accelerationVariance = getAccelerationVariance()

velocityVariance = velocityVariance +
  accelerationVariance * timeStep^2

estimateVariance = estimateVariance +
  velocityVariance * timeStep^2
```

### linear system model

If the system is described by a linear system model:

```matlab
y(t) = Cx(t) + Du(t) + e(t)
dx/dt = Ax(t) + Bu(t) + Ke(t)
```

Then variance can be updated using the same equations:

```matlab
estimateVariance =
  sum(C * dx * C') +
  D^2 * du +
  de

dxdtVariance = sum(diag(
  (dx.' * A) * A.' +
  B * du * B' +
  K * de * K'
))
```

+ `dx` is state variance. Initial state variance can be extracted from system model as `dx0` by using [idssdata](https://www.mathworks.com/help/ident/ref/idss.idssdata.html) and then updated each iteration.
+ `du` is input variance.
+ `de` is disturbance variance.
+ The prime (`'`) is Matlab notation for matrix transpose.
+ The dot followed by prime (`.'`) is Matlab notation for vector transpose.

Since Matlab guessed the system state for us, it also provided us with system state variance. However, we're still responsible for providing input and disturbance variances:

+ In the example where the input is a PWM command, the input variance would be the variance of the function that calculates this command (i.e. variance of the PID control loop).
+ In the example where the input is pressure on acceleration pedal and disturbance is caused by driver maneuvers, the input variance would be the variance of the sensor that measures pressure on the pedal and average driver disturbance variance.

## kalman filter in c++

In this final section let's look at a complete example of a Kalman filter in C++:

```cpp
double systemModel(
  double acceleration,
  double accelerationVariance,
  double& variance,
  double timeStep)
{
  static double position = 0.0;
  static double velocity = 0.0;
  static double velocityVariance = 0.0;

  velocity = velocity + acceleration * timeStep;
  position = position + velocity * timeStep;

  velocityVariance = velocityVariance +
    accelerationVariance * pow(timeStep, 2);

  variance = variance +
    velocityVariance * pow(timeStep, 2);

  return position;
}

// Kalman filter
double gain = 0.0;
double variance = 0.0;
double prediction = systemModel(
 input, inputVariance, variance, timeStep);

double kalmanFilter(
  double measurement,
  double measurementVariance,
  double input,
  double inputVariance,
  double timeStep)
{
  gain = variance / (variance + measurementVariance);

  double estimate = prediction + gain * (measurement - prediction);

  variance = (1 - gain) * variance;

  prediction = systemModel(
    input, inputVariance, variance, timeStep);

  return estimate;
}
```