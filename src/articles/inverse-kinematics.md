---
title: Inverse Kinematics
description: Numerical, Sampling-based, Analytical, and Geometric Solvers
image: ./images/360-video-pipeline.png
author: Valeriy Novytskyy
date: 2024-03-17
location: ^H Hackerspace
tags:
  [
    'engineering-robotics',
    'tool-cpp',
    'tool-arduino'
  ]
---

## introduction

*Inverse Kinematics* is a way to calculate the position that each robot arm joint would need to have in order for the gripper at the end of the arm, called the *end-effector*, to reach a specific point in space, sometimes with a specific orientation toward that point.

A software plugin that can compute joint positions given the desired goal pose is called an *Inverse Kinematics Solver* or *IK solver*.

## motivation

Open-source IK solvers like [KDL](https://orocos.org/wiki/Kinematic_and_Dynamic_Solvers.html) and [IKFast](http://openrave.org/docs/latest_stable/) are easy to setup but only address common scenarios encountered in robotics research labs. If you are building a custom robot, you could look for ways to appease the automated tools until they generate something that works, or learn how to write an IK solver yourself.

Learning about inverse kinematics is another hurdle, as many resources on the subject require extensive mathematical background and fail to provide practical examples, making this subject more complicated than necessary.

This article aims to put you on the fastest path to writing your own solver.

## background

If you're looking for more background, [Introduction to Robotics](https://www.amazon.com/Introduction-Robotics-Analysis-Control-Applications/dp/0470604468/ref) by Saeed Niku explains inverse kinematics using high-school level math:

![introduction to robotics](./images/inverse-kinematics-background.jpeg)

## overview

The following sections will define important concepts and dive right into working inverse kinematics code examples after a brief survey of approaches.

We will be using [MathWorks Matlab](https://www.mathworks.com/pricing-licensing.html?prodcode=ML&intendeduse=home) or [GNU Octave](https://octave.org/) for testing equations and [Blender](https://www.blender.org/features/) for visualizing solutions and robot geometry.

## robot description

Both *forward* and *inverse* kinematics require describing robot *joints*. This is often provided in the form of the *Universal Robot Description Format* ([URDF](https://wiki.ros.org/urdf)).

The types of joints you'll be dealing with most often are *Revolute* and *Prismatic*. Revolute joints rotate around the joint axis, and prismatic joints slide on it.

In the following video we will use Blender to re-create robot descriptions for [KUKA KR-5 industrial robot](https://github.com/orsalmon/kuka_manipulator_gazebo), [Basic robot arm](https://github.com/01binary/basic_velocity_control/tree/pretty/description), and [Str1ker drumming robot arm](https://github.com/01binary/str1ker_moveit_config).

TODO Insert Video Here

Using Blender simplifies working with robot description:

+ Each `<joint>` element in URDF (robot description file) defines a joint.
+ The joint `<parent>` element defines its parent (we will use *Make Parent without Inverse* to represent this in Blender).
+ The joint `<origin>` element defines the *offsets* from the previous joint with `xyz` attribute (translation on `X`, `Y` and `Z` axis in meters) and *twists* with `rpy` attribute (*roll*, *pitch*, *yaw* angles in radians).
+ The `<axis>` element defines the axis of rotation or sliding motion.
+ The `<limit>` element defines joint position, velocity, and effort limits.
+ The `<child>` element refers to the child `<link>` in the same file, which is a 3D model of a segment of the robot arm between the current and the next joint (for example, *forearm* is between *elbow* and *wrist*).
+ The corresponding `<link>` element for the child link contains a `<visual>` element that usually specifies the `<mesh>` element with the `filename` of the 3D model used to represent the link visually.

Once the models for the links associated with each joint are imported in Blender, parent-child relationships are setup, and offsets are specified for each joint, we will be able to use the Blender to calculate forward kinematics and visualize inverse kinematics solutions.

## representing joints

Joints are represented by `4x4` (*homogenous*) transformation matrices:

+ *Revolute* joints are defined by a revolution around an axis.
+ *Prismatic* joints are defined by a translation on an axis.

Linear and angular offset from the previous joint are also included:

+ *Linear offset* is usually the length or height of the previous link, and is defined by a constant translation.
+ *Angular offset* (or *twist*) is any constant rotation that is not on joint axis.

The position of the joint is called a *joint variable* because it could represent an angle in radians or an offset in meters. Joints may also have more than one degree of freedom (DOF) with one joint variable assigned to each DOF.

## joint matrix in blender

Once the robot is assembled in Blender, it's easy to extract joint matrices.

1. Turn one of the Blender panes into a **Python Console**. If you haven't customized anything previously, the Animation pane on the bottom is a great choice for being turned into a console pane. Click the dropdown menu with the *clock icon*, and choose *Python Console* pane type under the *Scripting* category.
2. Name your joints on the **Outliner** pane displayed on top right. You should be able to expand each joint to see the children.
3. Execute the following in the *Python Console* to extract the joint matrix (`bpy` is the Blender Python API singleton):

  `bpy.data.objects["joint_name"].matrix_local`

4. To extract the position and orientation of the end-effector in world space coordinates, use the `matrix_world` property:

  `bpy.data.objects["end_effector"].matrix_world`

If you followed these steps, you've just calculated forward kinematics!

It can be helpful to visualize joint coordinate frames by placing an *Empty Arrows* object as a child of the joint. Place one at the end of the kinematic chain to visualize the end-effector pose by clicking *Add* &gt; *Empty* &gt; *Arrows* in Blender, then parenting this new Empty object to the last joint *without inverse*:

TODO image of robot arm with empty arrows

## joint matrix in octave

To build a 4x4 joint matrix in [GNU Octave](https://octave.org/download):

```
pkg load matgeom

Joint = ...
  createTranslation3d(0, 0, 0) * ...    % offset
  createRotationOz(jointVariable) * ... % rotation on joint axis
  createRotationOx(pi / 2);             % twist
```

Once you have the matrices for each of the joints, calculate forward kinematics by multiplying them together to get the end-effector pose:

```
% Define Joint Variables
base = 0;
shoulder = -0.501821;
elbow = 0.904666;
wrist = 0.917576;

% Define Joint Frames
pkg load matgeom
Base = createRotationOz(base);
Shoulder = ...
  createTranslation3d(0, 0, 0.670) * ...
  createRotationOy(shoulder);
Elbow = ...
  createTranslation3d(0.7, 0, 0) * ...
  createRotationOy(elbow);
Wrist = ...
  createTranslation3d(0.7, 0.05, 0) * ...
  createRotationOx(wrist) * ...
  createTranslation3d(0.18, 0, 0);

% Calculate Forward Kinematics
EE = Base * Shoulder * Elbow * Wrist;
```

## joint matrix in matlab

To build a 4x4 joint matrix in [MathWorks Matlab](https://www.mathworks.com/products/matlab.html):

```
Joint = ...
  makehgtform(‘translate’, [0, 0, 0]) * ...   % offset
  makehgtform(‘zrotate’, jointVariable) * ... % rotation on joint axis
  makehgtform(‘xrotate’, pi / 2)              % twist
```

Multiply the joint matrices together to calculate forward kinematics:

```
% Define Joint Variables
base = 0;
shoulder = -0.501821;
elbow = 0.904666;
wrist = 0.917576;

% Define Joint Frames
Base = makehgtform('zrotate', base);
Shoulder = ...
  makehgtform('translate', [0, 0, 0.670]) * ...
  makehgtform('yrotate', shoulder);
Elbow = ...
  makehgtform('translate', [0.7, 0, 0]) * ...
  makehgtform('yrotate', elbow);
Wrist = ...
  makehgtform('translate', [0.7, 0.05, 0]) * ...
  makehgtform('xrotate', wrist) * ...
  makehgtform('translate', [0.18, 0, 0]);

% Calculate Forward Kinematics
EE = Base * Shoulder * Elbow * Wrist;
```

Matlab and Octave are essentially *Python REPLs*. The `...` (*ellipsis*) is used to wrap your code to the next line and `%` is a single-line comment.

Placing `;` at the end of the line will execute the line without echoing the output. Omitting `;` will echo the output of the calculation.

While MatLab pre-loads all add-ins and takes longer to start, Octave requires you to load packages manually by using `pkg load`.

## denavit-hartenberg

The *Denavit-Hartenberg* (DH) *parameters* are simply a convention for describing a joint transformation matrix as a function of four parameters:

+ Joint offset `d`: translation on Z axis
+ Joint angle `θ`: rotation on Z axis
+ Link length `a`: translation on X axis
+ Joint twist `α`: rotation on X axis

The *Denavit-Hartenberg matrix* can be built directly by using the following expressions for each matrix cell:

```
[cos(θ),  -sin(θ) * cos(α), sin(θ) * sin(α),  a * cos(θ)]
[sin(θ),   cos(θ) * cos(α), -cos(θ) * sin(α), a * sin(θ)]
[0,        sin(α),           cos(α),          d         ]
[0,        0,                0,               1         ]
```

...or multiplying the transforms as in this C++ example using the [Eigen3](https://eigen.tuxfamily.org/index.php?title=Main_Page) library:

```
#include <Eigen/Dense>

using namespace Eigen;

Matrix4d denavitHartenberg(
  double a, double d, double alpha, double theta)
{
  return (
    Translation3d(0, 0, d) *
    AngleAxisd(theta, Vector3d::UnitZ()) *
    Translation3d(a, 0, 0) *
    AngleAxisd(alpha, Vector3d::UnitX())
  ).matrix();
}
```

See [Octave](https://github.com/01binary/inverse-kinematics/tree/main/exercise11-denavit-hartenberg/octave) and [Matlab](https://github.com/01binary/inverse-kinematics/tree/main/exercise11-denavit-hartenberg/matlab) examples of defining joints using DH parameters and multiplying them together to calculate forward kinematics.

## types of ik solutions

There are several ways to solve inverse kinematics problems:

+ *Numerical* solvers measure *changes* to end-effector *pose* resulting from *changes* in *joint variables*, until they find a solution within tolerance.
+ *Sampling-based* solvers build a *graph* of random possible joint states and look for *connections* that lead to end-effector reaching *goal pose*.
+ *Analytical* solvers equate the *product of all joint matrices* with the end-effector *pose*, and solve the resulting *system of nonlinear equations*.
+ *Geometric* solvers use *trigonometry* to break the problem into multiple steps and solve for each joint variable on its own plane.

## numerical solvers

Numerical solvers iteratively *sample* poses calculated from combinations of *joint variables* by using *forward kinematics*.

Each joint variable is *increased* or *decreased* based on whether a *change* in this variable resulted in the end-effector pose getting *closer* to or *further* away from the goal. The search *stops* when the pose is within *tolerance of the goal*.

We will look at how to implement *gradient descent* and *newton-raphson iterator* numerical solvers in the following two sections.

## gradient descent

The *amount* by which to *increase* or *decrease* each joint variable is calculated by using a *gradient equation*:

1. Increment each joint variable `joints[j]` at iteration `n` by `Δ`:

  `joints[n][j] = joints[n - 1][j] + Δ`

2. Call the forward kinematics function with current values of all joint variables to get the end-effector pose.

  `pose[n] = forwardKinematics(joints[n])`

3. Get the difference in end-effector pose before and after incrementing the joint variable:

  `deltaPose = pose[n] - pose[n - 1]`

4. Compute the `error`, or how far the joint variable is from where it should be to reach the goal. Since `deltaPose` is expressed in world space units and `Δ` in joint space units, we divide `deltaPose` by `Δ` to convert it from world to joint space units. The `error` will be added directly to the joint variable in the next step, so it has to be expressed in the same units.

  `error = deltaPose / Δ`

5. Change the joint variable by the error amount, scaled by a `DAMPING` factor (`0.0` - `1.0`). This factor increases accuracy at the expense of time (low damping is high accuracy), so start with `1.0` and decrease until solutions are acceptable.

  `joints[n][j] -= error * DAMPING`

We can implement this in C++ using the [Eigen3](https://eigen.tuxfamily.org/index.php?title=Main_Page) library for matrix calculations. First define the forward kinematics function that can take a *vector of joint variables* and return the *end-effector pose*:

```
// fk.h
#include <Eigen/Dense>

using namespace Eigen;

Matrix4d forwardKinematics(MatrixXd jointVariables)
{
  return
    // Base
    (
      Translation3d(0, 0, 0) *
      AngleAxisd(jointVariables(0,0), Vector3d::UnitZ())
    ).matrix() *
    // Shoulder
    (
      Translation3d(0, 0, 0.670) *
      AngleAxisd(jointVariables(1,0), Vector3d::UnitY())
    ).matrix() *
    // Elbow
    (
      Translation3d(0.7, 0, 0) *
      AngleAxisd(jointVariables(2,0), Vector3d::UnitY())
    ).matrix() *
    // Wrist
    (
      Translation3d(0.7, 0.05, 0) *
      AngleAxisd(jointVariables(3,0), Vector3d::UnitX())
    ).matrix() *
    (
      Translation3d(0.18, 0, 0) *
      AngleAxisd(0.0, Vector3d::UnitX())
    ).matrix();
}
```

The algorithm starts by initializing the joint variables with an *initial guess*, which has a biasing influence on the outcome.

> For example, if your robot configuration is elbow-up, you would bias the shoulder joint to a negative value and the elbow to a positive value so that the algorithm first tries to reach the goal with elbow facing up.

See the [complete project](https://github.com/01binary/inverse-kinematics/tree/main/exercise15-gradient-descent) in the companion repository.

```
#include <iostream>
#include "fk.h"

using namespace std;

double distanceToGoal(
  Vector3d goalPosition, MatrixXd jointVariables);
double calculateError(
  Vector3d goal, MatrixXd jointVariables, int joint, double delta);

int main(int argc, char** argv)
{
  // Algorithm parameters
  const int MAX_ITERATIONS = 10000;
  const double DELTA = 0.001;
  const double DAMPING = 0.001;
  const double TOLERANCE = 0.0001;

  // Initial joint states
  const double BIAS_BASE = 0;
  const double BIAS_SHOULDER = -0.5;
  const double BIAS_ELBOW = 0.5;
  const double BIAS_WRIST = 0;

  // Parse goal position
  Vector3d goal;
  if (argc < 4) return 1;
  goal << stod(argv[1]), stod(argv[2]), stod(argv[3]);

  cout << "Inverse Kinematics (Gradient Descent)" << endl << endl;
  cout << "Given Pose ["
    << goal.x() << ", "
    << goal.y() << ", "
    << goal.z() << "]"
  << endl;

  // Run the algorithm
  MatrixXd jointVariables(4, 1);
  jointVariables <<
    BIAS_BASE, BIAS_SHOULDER, BIAS_ELBOW, BIAS_WRIST;

  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++)
  {
    for (int joint = 0; joint < jointVariables.rows(); joint++)
    {
      double error = calculateError(
        goal, jointVariables, joint, DELTA);

      jointVariables(joint, 0) -= DAMPING * error;
    }

    if (distanceToGoal(goal, jointVariables) < TOLERANCE) break;
  }

  cout << endl << "Joints" << endl << jointVariables << endl;

  return 0;
}

double distanceToGoal(Vector3d goalPosition, MatrixXd jointVariables)
{
  Matrix4d endEffector = forwardKinematics(jointVariables);
  Vector3d position = endEffector.block<3, 1>(0, 3);
  return (goalPosition - position).norm();
}

double calculateError(Vector3d goal, MatrixXd jointVariables, int joint, double delta)
{
  double first = distanceToGoal(goal, jointVariables);

  MatrixXd secondVariables = jointVariables;
  secondVariables(joint, 0) += delta;

  double second = distanceToGoal(goal, secondVariables);

  return (second - first) / delta;
}
```

## newton-raphson

The *newton-raphson iterator* algorithm is similar to *gradient descent*. The amount by which to *increase* or *decrease* each joint variable at each iteration is computed by using the *Jacobian matrix* inverse or transpose.

The Jacobian matrix describes *how much* the end-effector moves and rotates on each *axis* in response to each *joint variable* changing. Its inverse or transpose will give you the amounts by which joint variables change when the end-effector moves.

This matrix will have as many rows as the dimensions being tracked and as many columns as there are joint variables. In this example we calculate position-only IK so we are tracking 3 dimensions (end-effector X, Y, and Z).

For each joint `joints[j]` at iteration `n`:

1. Increment the joint variable by a small `Δ`:

  `joints[n][j] = joints[n - 1][j] + Δ`

2. Compute the resulting change in the end-effector pose by using forward kinematics (see `calculateJacobian` below):

  `pose[n] = forwardKinematics(joints[n])`

  `deltaPose = pose[n] - pose[n - 1]`

3. The difference between the end-effector poses is in world units, so we divide by `Δ` to express this in joint units instead. This becomes the weight recorded in the Jacobian matrix cell for the joint:

  `J[j] = deltaPose / Δ`

4. Compute the error (difference between the end-effector pose with given joint variables, and the goal pose):
  
  `error = goal - pose[n]`

5. Increase or decrease each joint variable by the `error`, which is weighted by the influence this joint variable has on the end-effector pose (looked up from the Jacobian matrix inverse or transpose) and scaled by the `DAMPING` constant used to control accuracy of the solution at the expense of runtime:

  `joints[n] += (J.transpose() * error) * DAMPING`

This algorithm builds a Jacobian matrix that encodes the influences (or weights) of joint variables on the end-effector position.

At each iteration, joint variables are changed according to the distance of the end-effector from the desired goal. The error amount used to correct each joint variable is scaled by the influence of that particular joint on the end-effector by looking up the corresponding weight in the Jacobian matrix.

See the [complete project](https://github.com/01binary/inverse-kinematics/tree/main/exercise16-newton-raphson) in the companion repository.

```
#include <iostream>
#include <Eigen/Dense>
#include "fk.h"

using namespace std;
using namespace Eigen;

Vector3d forwardKinematicsPositionOnly(MatrixXd angles)
{
  // Calculate end-effector position and orientation
  Matrix4d endEffector = forwardKinematics(angles);

  // Take only the position X Y Z
  return endEffector.block<3, 1>(0, 3);
}

MatrixXd calculateJacobian(const VectorXd& angles)
{
  const double EPSILON = 1e-6;
  const int joints = angles.size();

  Vector3d pose = forwardKinematicsPositionOnly(angles);
  MatrixXd jacobian(3, joints);

  for (int n = 0; n < joints; ++n)
  {
    VectorXd deltaAngles = VectorXd::Zero(joints);
    deltaAngles(n) = EPSILON;

    const Vector3d diff =
      forwardKinematicsPositionOnly(angles + deltaAngles) - pose;

    jacobian.block<3, 1>(0, n) = diff / EPSILON;
  }

  return jacobian;
}

int main(int argc, char** argv)
{
  // Algorithm parameters
  const int MAX_ITERATIONS = 10000;
  const double TOLERANCE = 0.001;
  const double DAMPING = 0.5;

  // Initial joint states
  const double BASE_BIAS = 0;
  const double SHOULDER_BIAS = 1;
  const double ELBOW_BIAS = -1;
  const double WRIST_BIAS = 0;

  if (argc < 4) return 1;

  cout << "Inverse kinematics" << endl << endl;
  cout << "Given Position" << endl;
  cout << "[ "
    << argv[1] << ", "
    << argv[2] << ", "
    << argv[3]
    << " ]"
    << endl
    << endl;

  Vector3d goalPose;
  goalPose << stod(argv[1]), stod(argv[2]), stod(argv[3]);

  VectorXd angles(4);
  angles << BASE_BIAS, SHOULDER_BIAS, ELBOW_BIAS, WRIST_BIAS;
  
  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++)
  {
    Vector3d pose = forwardKinematicsPositionOnly(angles);
    Vector3d error = goalPose - pose;

    if (error.norm() < TOLERANCE) break;

    MatrixXd Jtranspose = calculateJacobian(angles).transpose();
    angles = angles + DAMPING * (Jtranspose * error);
  }

  cout << endl << "Angles" << endl << angles << endl;

  return 0;
}
```

## sampling solvers

*Sampling-based* solvers create a *graph* of randomly sampled *states* (each state with different *joint variables*) and look for a *path* through this graph that reaches the desired *goal pose*.

TODO illustration

> Sampling solvers are popular because they are able to find a path to the goal in the presence of obstacles like joint limits or actual physical objects.

Like other numerical solvers, they use an iterative algorithm which takes time and could fail to find a solution. A unique limitation of sampling solvers is that they require at least 6-DOF to make arbitrary points in space reachable.

It's useful to know the basic theory behind this type of solver, but we won't gain much by implementing our own since it would be subject to the same limitations as the KDL solver, which can be automatically configured by a setup wizard in [MoveIt](https://moveit.ros.org/) framework for working with robot arms.

## analytical solvers

*Analytical* solvers equate the product of all *joint matrices* with the *end-effector pose*. This matrix equation then breaks down into a *system of nonlinear equations* (one for each matrix cell).

## analytical ik

## geometric ik