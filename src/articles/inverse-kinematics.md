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

*Inverse Kinematics* is a way to calculate the position each robot arm joint would need to have in order for the gripper at the end of the arm, called the *end-effector*, to reach a specific point in space, sometimes with a specific orientation toward that point.

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

> Robot arms face down the positive X axis by convention, with Z axis pointing up. This convention is used by [Denavit-Hartenberg parameters](#denavit-hartenberg) and in many open-source robotics frameworks like [MoveIt](https://moveit.ros.org/).

## representing joints

Joints are represented as `4x4` (*homogenous*) transformation matrices:

+ *Revolute* joints are defined by a revolution around an axis.
+ *Prismatic* joints are defined by a translation on an axis.

Linear and angular offset from the previous joint are also included:

+ *Linear offset* is usually the length or height of the previous link, and is defined by a constant translation.
+ *Angular offset* (or *twist*) is any constant rotation that is not on joint axis.

The position of the joint is called a *joint variable* because it could represent an angle in radians or an offset in meters. Joints may also have more than one degree of freedom (DOF) with one joint variable assigned to each DOF.

## joint matrix in blender

Once the robot is assembled in Blender, it's easy to extract joint matrices.

1. Turn one of the Blender panes into a **Python Console**. If you haven't customized anything previously, the Animation pane on the bottom is a great choice for being turned into a console pane. Click the dropdown menu with the *clock icon*, and choose *Python Console* pane type under the *Scripting* category.
2. Name your joints on the **Outliner** pane displayed on top right by default. You should be able to expand each joint to see the children.
3. Execute the following in the *Python Console* to extract the joint matrix:

```
bpy.data.objects["joint_name"].matrix_local
```

To extract the position and orientation of the end-effector in absolute (world space) coordinate frame, use the `matrix_world` property:

```
bpy.data.objects["end_effector"].matrix_world
```

> If you followed these steps, you've just calculated forward kinematics: when each joint is rotated or translated on its main axis of movement, the world-matrix of the last joint will give you the end-effector pose.

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

## joint matrix in matlab

To build a 4x4 joint matrix in [MathWorks Matlab](https://www.mathworks.com/products/matlab.html):

```
Joint = ...
  makehgtform(‘translate’, [0, 0, 0]) * ...   % offset
  makehgtform(‘zrotate’, jointVariable) * ... % rotation on joint axis
  makehgtform(‘xrotate’, pi / 2)              % twist
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

The main limitation of this convention is that *revolute* joints can only rotate on `X` or `Z` axis while *prismatic* joints can only move on `X` or `Z` axis. This means that in some cases, you have to apply extra *twists* to re-align the axis.

> Example: your robot has a platform that rotates on `Z` axis. The next few joints like shoulder and elbow must rotate on `Y` axis. Specifying a `90 degree` twist on `X` axis by using the `α` parameter will rotate the `Z` axis to point sideways, where `Y` axis was pointing earlier. The joints can then rotate on `Z` axis while visually appearing to to rotate on `Y`.

The *Denavit-Hartenberg matrix* can be built by multiplying transforms as we have done earlier when representing joints separated from each other by *offset* and/or *twist*, or directly like this:

```
[cos(θ),  -sin(θ) * cos(α), sin(θ) * sin(α),  a * cos(θ)]
[sin(θ),   cos(θ) * cos(α), -cos(θ) * sin(α), a * sin(θ)]
[0,        sin(α),           cos(α),          d         ]
[0,        0,                0,               1         ]
```

## types of ik solutions

There are several ways to solve inverse kinematics:

+ *Numerical* solvers measure *changes* to end effector *pose* resulting from *changes* in *joint variables*, until they find a solution within tolerance.
+ *Sampling-based* solvers build a *graph* of random possible joint states and look for *connections* that lead to end effector reaching *goal pose*.
+ *Analytical* solvers equate the *product of all joint matrices* with the end effector *pose*, and solve the resulting *system of nonlinear equations*.
+ *Geometric* solvers use *trigonometry* to break the problem into multiple steps and solve for each joint variable on its own plane.

In this tutorial we will implement numerical, analytical, and geometric solvers that do not take joint limits into account and do not perform collision detection.

## numerical solvers

Numerical solvers iteratively *sample* poses calculated from combinations of *joint variables* by using *Forward Kinematics*.

Each joint variable is *increased* or *decreased* based on whether a *change* in this variable resulted in FK pose getting *closer* to or *further* away from the goal. The search *stops* when the pose is within *tolerance of the goal* or upon reaching a *timeout*.

We will look at how to implement gradient descent and newton-raphson iterator numerical solvers in the following two sections.

## gradient descent

## newton-raphson

## sampling solvers

## analytical solvers

## analytical ik

## geometric ik