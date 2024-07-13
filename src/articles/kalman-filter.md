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
    'tool-matlab',
    'tool-cpp'
  ]
---

## overview

The Kalman filter is popular because it can generate accurate estimates in the presence of uncertainty and measurement noise. Simpler techniques like moving average or low pass filters introduce delay or miss important events, which is unacceptable for dynamic systems like cars and robots.

## background

In this article I introduce the Kalman Filter in the shortest way possible with practical examples. When you're ready to go deeper check out *Kalman Filter from the Ground Up by Alex Becker* at [kalmanfilter.net](https://www.kalmanfilter.net/default.aspx):

![kalman filter from the ground up](./images/kalman-background.png)

## why not average?

A basic *moving average* filter can be implemented as follows:

```matlab
function output = movingAverageFilter(input, size)
  buffer = ones(size, 1) * input(1);
  output = zeros(length(input))

  for sampleIndex = 1:length(input)
    bufferIndex = mod(sampleIndex - 1, size) + 1;
    buffer(bufferIndex) = input(sampleIndex);
    output(sampleIndex, 1) = sum(buffer) / size;
  end
end
```

Compare the filter result to the original data with buffer size `8`, `32`, and `64`:

![moving average filter](./images/kalman-avg.png)

Filtered data has been shifted forward on the time axis proportionately to the smoothing amount, introducing *delay*:

+ In the case of DC motor control for robotics, a moving average filter would cause the [PID](https://www.ni.com/en/shop/labview/pid-theory-explained.html) algorithm to oscillate, as it would see this delay as a signal that it's not working hard enough, and over-compensate. 
+ In the case of a vehicle, a moving average would cause the estimated position to lag too far behind, causing the navigation system to suggest changes to the route too late for the driver to respond.

## why not low pass?

A basic *low-pass* filter can be implemented as follows:

```matlab
function output = lowPassFilter(input, coefficient)
  estimate = input(1);
  output = zeros(length(input))

  for sampleIndex = 1:length(input)
    estimate = (1.0 - coefficient) * estimate + ...
      coefficient * input(sampleIndex);

    output(sampleIndex, 1) = estimate;
  end
end
```

Compare the filter result with `0.1` and `0.001` coefficients to the original data:

![low pass filter](./images/kalman-lowpass.png)

This filter missed short temporal spikes in the data. This may be fine if the system is cyclical in nature, but if the subsequent state depends on previous system state, missing events could cause it to diverge far from reality.

In the following video we test the moving average filter on real data:

`youtube:https://www.youtube.com/embed/rLM0os3vpsw`

## why predict?

If you know what a moving vehicle or a motor shaft are supposed to do (*since you are controlling them in the first place*), why should you let measurements have so much influence on where they are estimated to be next?

In the case of a DC motor, commanded velocity can be used to determine the shaft position:

![motor model](./images/kalman-motor.png)

```matlab
% System Identification (5202 Series Yellow Jacket Motor)
MAX_PWM = 65536;
MAX_VELOCITY_RPM = 30;
MAX_VELOCITY = MAX_VELOCITY_RPM * PI * 2 / 60;
PWM_NONLINEARITY = [1.0, 1.023, 1.03, 1.0, 0.98, 0.93, 1.0];

% System Model
function nextPosition = systemModel(input, position, timeStep)
  % Normalize PWM to 0...1 range
  norm = input / MAX_PWM;

  % Map to velocity adjusting for PWM non-linearity curve
  index = round(length(PWM_NONLINEARITY) * norm);
  velocity = norm * PWM_NONLINEARITY[index] * MAX_VELOCITY;

  % Predict position
  nextPosition = position + velocity * timeStep;
end
```

In the case of a moving vehicle, the pressure on the gas pedal can determine acceleration, which then determines velocity and position:

![vehicle model](./images/kalman-vehicle.png)

```matlab
% System Identification (Chevrolet Trax 2017 4WD)
MAX_ACCELERATION = 2.82;
DRAG_COEFFICIENT = 0.35;
FRONTAL_AREA = 2.5;
AIR_DENSITY = 1.225;

% System Model
function [nextPosition, nextVelocity] = systemModel(...
  input, position, velocity, timeStep)
  % Map pressure on gas pedal to acceleration
  acceleration = ...
    input * MAX_ACCELERATION

  % Subtract drag force
  drag = DRAG_COEFFICIENT / 2.0 * ...
    AIR_DENSITY * FRONTAL_AREA * velocity^2;

  acceleration = acceleration - drag;

  % Predict velocity
  nextVelocity = velocity + acceleration * timeStep;

  % Predict position
  nextPosition = position + velocity * timeStep;
end
```

The first special thing about the Kalman filter is that it blends *measurements* with *predictions*, depending on which can provide the most accurate estimate:

+ Start with an initial guess as the first estimate
+ Determine how certain the estimate is
+ Take a measurement
+ Determine how certain the measurement is
+ Blend prediction with measurement depending on which is more certain
+ Predict the next estimate

We will examine each of these steps in detail in the following sections.

> The Kalman filter works by recursively predicting the object state using the motion model and correcting the state using measurements. -- [Matlab Sensor Fusion and Tracking Toolbox](https://www.mathworks.com/help/fusion/ug/linear-kalman-filters.html)

## variance

The second special thing about the Kalman filter is that its output isn't simply a value but a *likelihood of it being a certain value*. This concept is borrowed from statistics where it's called a *random variable*.

+ A random variable is defined by a *mean* and a *spread* from that mean.
+ The *mean* is a sum of a set of samples divided by the size of the set. This represents the *center* of the random variable.
+ The spread from the mean is called *variance* and it's denoted by the greek letter σ (sigma).
+ The *shape* of this spread is a "bell curve" called a *Gaussian distribution*.

Measuring physical quantities results in readings that follow this Gaussian distribution due to the [Holographic Principle](https://www.semanticscholar.org/paper/The-Holographic-Principle-Opening-Lecture-Hooft/43ce0cb38dba603c08c21d135fa4754fa5a95a41) of the Universe:

> The one-dimensional array of data that makes up the entire content of the Universe is stretched over a 3D surface with 1 bit of information every 0.724 x 10<sup>-64</sup>cm<sup>2</sup>.

When the Universe is "sampled" by taking a measurement, the sample is interpolated by using a strategy discovered by Carl Gauss: surrounding bits are blended in depending on distance of the sample from the "center" of each bit.

![variance](./images/kalman-variance.png)

Variance can be calculated from a set of samples as follows:

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

The following video demonstrates how to calculate variance:

`youtube:https://www.youtube.com/embed/-RpGzyQoaOg`

## kalman gain

To produce optimal estimates, the Kalman filter has to know whether the system model is more or less reliable than the measurements.

Measurement uncertainty, model uncertainty, and the uncertainty of the initial guess are provided as parameters to the algorithm.

The ratio of estimate uncertainty to measurement uncertainty is calculated at each iteration. This ratio is called the Kalman gain and used as a weight to correct predictions with measurements.

Similar to other iterative optimization algorithms like [Gradient Descent](https://www.01binary.us/articles/inverse-kinematics/#gradient-descent) or [Newton-Raphson Iterator](https://www.01binary.us/articles/inverse-kinematics/#newton-raphson), the Kalman filter has to calculate an *error* at each iteration. This error is defined as the difference between the prediction and the measurement.

The error is then used to correct the model, with the correction amount determined by the Kalman gain:

+ If the measurements are trusted more, the Kalman gain will be closer to `1` which will correct the model prediction by a greater amount.
+ If the model is trusted more, the Kalman gain will be closer to `0` which will correct the model prediction by a lesser amount.

Since the estimates are a function of the model internal state, we can't directly modify the model output. Instead we determine the change that needs to be made to the model state to get the desired corrected output.

After correcting the model state, the *estimate uncertainty* is updated by blending measurement uncertainty with model uncertainty with the same ratio used to correct the system state:

+ If the estimate was based more on the measurement, then the estimate uncertainty reflects more of the measurement uncertainty.
+ If the estimate was based more on the model prediction, then the estimate uncertainty reflects more of the model uncertainty.

## covariance

For a system model with a single state variable, the model and estimate uncertainties are represented by scalar *variances*.

For a system with multiple state variables, the model and estimate uncertainties are represented by square *covariance* matrices with the same number of rows and columns as there are state variables.

Covariance matrices in a Kalman filter with more than one state variable are used to:

+ Represent the *initial guess uncertainty* and the current *estimate uncertainty*.
+ Represent how much uncertainty is added at each iteration due to an imperfect model of the system that suffers from *noise* or *disturbances*.

In a covariance matrix, the diagonal entries are variances, and the off-diagonal entries are *covariances*.

## estimate covariance

A covariance matrix that encodes the estimate uncertainty of a system with two state variables (position and velocity) would look like this:

![motor model](./images/kalman-covariance2x2.png)

This matrix encodes the following information:

+ The *variance of position* (how far the estimated position could be from the true position, squared)
+ The *variance of velocity* (how far the estimated velocity could be from the true velocity, squared)
+ The *covariance* of position and velocity (the mathematical relationship between position and velocity random variables), with `0` indicating the two variables are not related.

A covariance matrix that encodes the estimate uncertainty of a system with three state variables would follow the same pattern:

![motor model](./images/kalman-covariance3x3.png)

There are a few ways to construct an estimate covariance matrix.

If you have a data set that records the system state over time (from measuring a real system or a simulated system) you could use Matlab's [cov](https://www.mathworks.com/help/matlab/ref/cov.html) function, simply passing the entire data set as a matrix:

```matlab
dataset = readmatrix("states.csv");
covariance = cov(dataset);
```

If you know the variances of the state variables, you could fill in the diagonal terms and leave off-diagonal terms blank, indicating that the state variables are not related:

```matlab
covariance = diag([ ...
  100, ...
  200, ...
  300 ...
]);

covariance =

   100     0     0
     0   200     0
     0     0   300
```

This will usually work because the Kalman filter will converge on a more accurate estimate covariance over many iterations and fill in those off-diagonal entries for you.

Lastly, you could *project* the same variance across the board:

```matlab
variance = 200;

covariance = ...
  eye(length(state)) * ...
  variance

covariance =

   200     0     0
     0   200     0
     0     0   200
```

## noise covariance

A process *noise* or *disturbance* covariance matrix looks exactly like estimate covariance, but it encodes the covariance of random *noise* affecting each state variable within a single algorithm iteration.

> Noise or disturbance is the difference between the system model and the real system. Its covariance represents the likelihood of state variables being affected by random occurrences like external forces, noise, or the system state being derived from imperfect (noisy) inputs.

Similarly to estimate covariance, you could build a disturbance covariance matrix by *projecting* the same *variance* across the board:

```matlab
noiseCovariance = ...
  eye(length(state)) * ...
  noiseVariance
```

You could also plug in the approximate variances for noise or disturbances affecting each state variable, leaving off-diagonal entries blank:

```matlab
noiseCovariance = diag([ ...
  positionNoiseVariance, ...
  velocityNoiseVariance, ...
  accelerationNoiseVariance ...
])
```

Another option is using the [covar](https://www.mathworks.com/help/control/ref/dynamicsystem.covar.html?s_tid=doc_ta) function available in Matlab Control System Toolbox if the system was identified with Matlab Control Toolbox:

```matlab
noiseVariance = 200;

[ ...
  % Estimate variance
  P, ...
  % Disturbance covariance
  Q ...
] = covar(ss, noiseVariance)
```

Finally, you could simulate your system model using the same data set used to identify the system, and calculate the difference between the original measurements and the system model at each iteration.

Since the system model includes a *measurement* matrix which maps system state to system output, you could multiply the difference between the original measurement and the prediction by the inverse of this matrix to calculate the noise affecting each state variable at that iteration.

With these differences recorded in a separate vector for each state variable, you could then use the `cov` function in Matlab to generate a process noise matrix with all of the elements filled in.

We will go over how to simulate a continuous discrete systems in the simulation section.

## system identification

The system model can be derived by analyzing the system (as we did in the overly simplified examples of a vehicle and PWM-controlled motor in [why predict?](#why-predict) section earlier), or by using [system identification](https://www.mathworks.com/products/sysid.html).

> A system identification algorithm tries to guess the system model given system input and output tracked over time.

In the following video we'll identify a system by using a [linear state-space model](https://www.mathworks.com/help/control/ref/ss.html) in Matlab because it's simple and provides great estimates:

`youtube:https://www.youtube.com/embed/D8Q-FoiqhiA`

A discrete linear state-space model is described by two equations:

```matlab
% Predict
y = Cx + Du + e

% Update state
x = Ax + Bu + Ke
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

The properties of the identified system can be extracted by using [idssdata](https://www.mathworks.com/help/ident/ref/idss.idssdata.html):

```matlab
[A,B,C,D,K,x0,dA,dB,dC,dD,dx0] = idssdata(systemModel);
```

...or by using an object property notation, for example:

```matlab
systemModel.dx0
```

The following properties are available:

* `A`, `B`, `C`, `D`, `K` are the weights described earlier
* `dA`, `dB`, `dC`, and `dD` are the variances of system state and inputs
* `x0` is initial state (plug this into the equations to get the initial guess)
* `dx0` is the variance of the initial state

The best way to compare the identified system to original measurements is by viewing Model Output in System Identification app, as demonstrated in the video.

For more background on system identification, try this [series of tutorials](https://ctms.engin.umich.edu/CTMS/index.php?aux=Home) assembled by two professors at Carnegie Mellon university.

## simulation

TODO

```matlab
% TODO: update code snippet for discrete system

% Generate a vector with evenly spaced time samples
startTime = 0
endTime = 8
timeStep = 0.02
time = linspace(startTime, endTime, (endTime - startTime) / timeStep)

% Get initial system state
[A,B,C,D,K,x0,dA,dB,dC,dD,dx0] = idssdata(systemModel);

% Simulate the system with original input and initial state
simulatedOutput = lsim(systemModel, input, time, x0)
```

Implementing a discrete state-space system model in Matlab:

```matlab
% A weights (3x3 matrix)
A = [ ...
  0.9988,     0.05193, -0.02261;
  0.02222,   -0.01976,  0.7353;
  0.0009856, -0.2093,  -0.5957;
];

% B weights (3x1 vector)
B = [ ...
  -0.00000266;
  0.0000572747;
  -0.0001872152;
];

% C weights (1x3 vector)
C = [ ...
  -5316.903919, ...
  24.867656, ...
  105.92416 ...
];

% D weight (scalar)
D = 0;

% K weights (3x1 vector)
K = [ ...
  -0.0001655;
  -0.001508;
  6.209e-06;
];

% Initial state (3x1 vector)
x0 = [ ...
  -0.0458;
  0.0099;
  -0.0139;
];

% Simulate
input = []; % get input from somewhere
x = x0;
output = zeros(length(input), 1);

for i = 1:length(input)
  u = input(i);
  [y, x] = systemModel(A, B, C, D, K, x, u, 0);
  output(i) = y;
end

% Discrete state-space system model
%   x: system state
%   u: system input
%   e: disturbance
% returns:
%   system output and next system state
function [y, x] = systemModel(A, B, C, D, K, x, u, e)
  % Predict
  % y = Cx + Du + e
  y = ...
    C * x + ...  % Add contribution of state
    D * u + ...  % Add contribution of input
    e;           % Add disturbance

  % Update state
  % x = Ax + Bu + Ke
  x = ...
    A * x + ... % Add contribution of state
    B * u + ... % Add contribution of input
    e * K;      % Add contribution of disturbance
end
```

Implementing a discrete state-space system model in C++:

```cpp
#include <vector>
#include <Eigen/Dense>

using namespace std;
using namespace Eigen;

// A weights (3x3 matrix)
const MatrixXd A
{
  { 0.998800,   0.05193, -0.02261 },
  { 0.0222200, -0.01976,  0.7353  },
  { 0.0009856, -0.20930, -0.5957  }
};

// B weights (3x1 vector)
const RowVectorXd B {{
  -0.00000266,
  0.0000572747,
  -0.0001872152
}};

// C weights (1x3 vector)
const VectorXd C {{
  -5316.903919,
  24.867656,
  105.92416
}};

// D weight (scalar)
const double D = 0;

// K weights (3x1 vector)
const RowVectorXd K {{
  -0.0001655,
  -0.001508,
  6.209e-06
}};

// Initial state (3x1 vector)
const RowVectorXd x0 {{
  -0.0458,
  0.0099,
  -0.0139
}};

/*
  * Discrete state-space system model
  * @param x: system state to update
  * @param u: system input
  * @param e: disturbance
  * @return: system output
*/
double systemModel(
  RowVectorXd& x, double u, double e)
{
  // Predict
  // y = Cx + Du + e
  double y =
    // Add contribution of state
    C.dot(x) +
    // Add contribution of input
    D * u +
    // Add disturbance
    e;

  // Update state
  // x = Ax + Bu + Ke
  x =
    // Add contribution of state
    x * A +
    // Add contribution of input
    B * u +
    // Add contribution of disturbance
    K * e;

  return y;
}

bool read(double& input)
{
  // get input from somewhere...
}

// Simulate
int main(int argc, char** argv)
{
  RowVectorXd state = x0;
  vector<double> output;
  double disturbance = 0.0;
  double input;

  while(read(input))
  {
    double prediction = systemModel(
      state, input, disturbance);

    output.push_back(prediction);
  }

  return 0;
}
```

See the complete examples in the [companion repository](https://github.com/01binary/kalman).

## kalman filter

The Kalman filter starts with an initial guess, initial uncertainty, and initial system state.

Each iteration,

```matlab
% Initialize
state = x0;
covariance = P0;
estimate = 100;

% Filter
for i = 1:length(inputs)
  % Read input
  input = inputs(i);

  % Take measurement
  measurement = measurements(i);

  % Correct state
  [state, covariance, gain] = kalmanFilter( ...
    prediction, ...
    measurement, ...
    state, ...
    covariance, ...
    gain ...
  );

  % Predict and update state
  [state, prediction] = systemModel( ...
    state, ...
    input ...
  );
```

## initial guess

Initial guess can be an initial measurement, or the output of the system model with initial state. The initial guess does not have to be accurate.

```matlab
prediction = initialGuess
estimateVariance = initialGuessVariance
```

The initial variance depends on where the initial guess came from.
+ If the initial guess was from a measurement, use the variance of the measurement device. See [variance](#variance) section above for determining how to calculate variance by taking a set of samples from your device.
+ If the initial guess was from a system model, use the variance of the model. We will go over identifying system models with Matlab in [system identification](#system-identification) and estimating variance in [estimating variance](#estimating-variance).
+ If you can express variance in terms of *tolerance* by using it in a sentence like "this estimate is within *x* or +/- *x*", then square half the tolerance amount to convert it to variance: `variance = (tolerance / 2)^2`.

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

The Kalman gain is adjusted at each iteration to give more weight to measurements or prediction, depending on which has the *least variance*:

```matlab
gain = estimateVariance /
  (estimateVariance + measurementVariance)
```

## estimate

Next prediction is blended with measurement by using the Kalman gain:

```matlab
estimate = prediction + gain * (measurement - prediction)
```

+ If **prediction** from system model has less variance, the model is trusted more and corrected with measurement by a lesser amount
+ If **estimate** has less variance, the measurement is trusted more and the model is corrected with measurement by a greater amount

Estimate variance is then scaled by the amount of the correction that took place. This represents a greater certainty in the estimate after correction.

```matlab
estimateVariance = (1 - gain) * estimateVariance
```

## prediction

The prediction is updated based on the system model as discussed earlier:

```matlab
prediction = systemModel(input)
```

## kalman filter in c++

In this final section let's look at a complete example of a Kalman filter in C++:

```cpp
// TODO: this code sample has not been compiled and tested yet
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
