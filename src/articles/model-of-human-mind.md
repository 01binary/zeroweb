---
title: A Model of the Human Mind
description: Applying Functional Programming to Philosophy
image: ./images/blank.png
author: Valeriy Novytskyy
date: 2022-06-28
location: Pope House
tags:
  [
     'philosophy', 'physics', 'signal', 'fp'
  ]
---

## introduction

As I became more familiar with Socrates and Freud and started practicing daily meditation, I realized that many of the concepts I was learning were connected:

- All authors have the same model of the human mind.
- One calls it the Soul while the other calls it Personality, and yet another calls it Consciousness.
- All theories divide the mind into three elements responsible for thinking, feeling, and doing.
- The three elements are described as information processing nodes that take input and produce output.
- The elements are always weighted in some proportion to each other based on how many connections are made to each one as a percentage of total available connections.
- Each element shares the characteristics of the whole mind, such as being composed of information-processing sub-nodes, making them more like "partitions" over the computing volume of the mind.
- Each one is single-minded and driven by its own purpose in an endless cycle to optimize and maximize through learning.

This arrangement mirrors my favorite areas of computer science like digital signal processing and functional programming.

## why study the mind?

All of the above authors have their own reasons for studying the mind and approach the subject from different perspectives:

- Freud is like a craftsman who is more concerned with the "how". He studies practical implications of the mind’s internal structure, so that this knowledge can be applied by regulating the three elements in order to fix unwanted behavior.
- Socrates is like a scholar who is more concerned with the "why". He uses deductive reasoning to explain why the mind is organized the way it is, and leverages this knowledge to self-regulate or compete with others by understanding their strengths and weaknesses better than they do. Socrates compares the three elements to strings on a musical instrument: you can produce unique and pleasing sounds as long as the elements tuned are in specific proportions to each other.
- Sensei that teach meditation are like artists more concerned with the connections made by the mind, so that this knowledge can be used to increase awareness. They want to help you tune your mind to the rest of the band, and learn to play your own part of the Universe’s symphony by paying attention to your senses.

## the three elements

Why are the three elements separate? Optimizing each sub-mind (thinking, feeling, doing) in isolation to follow its own objectives and then summing them has the capability of producing more accurate and efficient output than if there was only one mind with a multitude of objectives.

> If you spin up a neural network in Azure Machine Learning and ask it to detect objects in pictures at the same time as finding the quickest way to cook rice in various atmospheric conditions, you will see what I mean.

- Your very first task would be scoring, which will drive learning and overall success of the project.
- Do you score each answer based on how successful the object detection was?
- Do you score based on the best rice recipe?
- If you score on both, which one is more important?
- If you make one more important, then the quality of the other will suffer, and vice versa.
- Every decision would involve a built-in trade-off.
- The weights assigned to the decisions would be recorded at the time of learning, making the system too rigid to handle highly dynamic environments.
- To compensate for mis-match between present conditions and conditions at the time of learning, you would need a way to re-mix the decisions dynamically.

When the decision-making elements are separate, each one makes the best decision based on its past experiences, and then the results are blended together to tailor the output to what’s currently happening. As a bonus, you get a fully decoupled system that’s easy to debug and test. For example see Separation of Concerns and Query-Command Separation software development principles used to motivate de-coupled component design.

Why are there there three elements, and why do they have these specific tasks?

- You get these three elements because your mind is a partition over the larger Universal Consciousness, thus it shares in the Universe’s characteristics.
- See the previous article: A Theory of Consciousness.
- The three elements that make up the Universal consciousness are Planning, Sensing, and Execution, so when you grab a slice of that consciousness, you end up with all three elements present.

Why does the Universe itself consist of these three elements?

- In A Theory of Consciousness, the first article in this series, I make the case that the Universe is engaged in a large scale effort to understand itself by taking raw data from its "unexplored" parts and forming it into structures.
- It works like a data transformation pipeline and can be modeled by using functional programming concepts.
- Data transformation pipelines consist of functions
- A function maps a range of inputs into a range of outputs and is characterized by three features: input (sensing), transform (thinking), and output (execution)
- The relationship between the three elements is that the inputs are connected to outputs through the transform graph

## planning element

Socrates calls it "Rational" and Freud calls it the "Super-ego", meaning that the real ego is "behind" it. It's also compared to a chariot driver, a gardener, and a king. The modern term might be a "manager".

This element is characterized by:

- Being truth-loving, order loving, reason-loving
- Single-minded devotion to learning, planning, and resource management.

It is responsible for:

- Managing and maintaining the other two elements
- Predicting and comparing outcomes to select an optimal plan of action
- Endlessly looking for patterns and fitting incoming data into existing patterns

This element learns by:

- Receiving positive signals: goal reached
- Receiving negative signals: goal not reached because of poor planning, inaccurate estimation, or lack of knowledge and experience
- It has to learn how to work with the other two elements and blend their outputs to tailor decisions to what is currently happening
- It has to identify and fill gaps in knowledge and skill

This element has the following effects on behavior:

- **In Range**: takes sensor inputs advertised by the Sensing element into account to plan and prioritize goals, then directs the Executive element to carry them out
- **Hypo**: allows feelings or blind instinct to take over depending on whether the Sensing or the Executive element is stronger
- **Hyper**: If Sensing element is weak: fails to consider feelings and makes assumptions instead, resulting in poor health, inability to communicate, and operating on wrong assumptions. If Execution element is weak: has lots of ideas but leads a mediocre life due to inability to bring them to fruition.

## execution element

Socrates calls this element "Spirited" and Freud calls it the "Ego".

- Socrates compares it to a lion or a white horse because it’s strong and courageous.
- Freud denotes this as the part of mind shaped by interacting with the physical world. If you think in three dimensions, the Ego is an *extension* of the Superego, a bridge that connects consciousness to the physical world.

This element is characterized by being honor-loving, victory-loving, and having a single-minded devotion to achieving goals.

It is responsible for:

- Transforming the incoming energy into an efficient stream of actions to reach the goal selected by the Planner.
- Self-preservation and protecting others.
- Competition with others for the same goal.

It can receive positive signals to drive learning:
- Getting closer to the goal and winning over the competition
- Safety and lack of danger

There are also negative signals:
- Failure to reach a goal because of too slow a response or a lack of effort
- Loosing in a competition with others who are trying to reach the same goal
- Loosing in a fight or struggle

This element learns by:
- Responding faster if the goal was not reached due to a slow response
- Becoming stronger and/or smarter if over-powered in a struggle
- Winning in competitions
- Increasing strength through training, to achieve a level of fitness required to win goals

It generally prefers to acquire goals through raw strength, leaving the fine details of planing to the Planner.

This elements affect behavior in the following ways:

- **In Range**: relentless execution that reaches goals at any cost
- **Hypo**: laziness and lack of motivation
- **Hyper**: blindly charging into different situations without planning and feeling, wasting energy, or using energy to create more problems instead of solving them

## sensing element

Socrates call this the "Appetitive" element and Freud calls it the "Id". It is compared to a snake that can grow many heads, or a black horse with a character that’s hard to control.

This element is characterized by its sensitive, complex, and multifaceted nature.

- It can *scale* to track any number of sensory inputs (this may be the property that invites a comparison to a snake with many heads).
- It performs *adoptive input sensing*. The strength of "desire" and "relief" signals it outputs depends on the min/max range of recently sampled data. Samples clipping outside of range first generate very intense signals, and then the system adopts to the new range over time, making the same inputs produce less intense signals.

This element is responsible for:

- Providing accurate, high-gain, low-noise feedback signals to inform the planning and execution elements
- Advertising unfulfilled needs to the Planner and reporting the intensity of each need based on the adoptive input range processing
- Constantly searching for new needs that need to be fulfilled, determine their range, and advertise them to the Planner

It learns by receiving positive signals:

- Advertised desires are kept in satisfactory range
- Feedback provided to other elements helps them to successfully reach their own goals in a way that’s most efficient

Negative signals include:

- Advertised desires were not useful (ignored by the planner) and thus left unfulfilled
- Feedback signals not high-gain enough, have too much noise, are too inaccurate or otherwise not useful
   
This element has to learn to stop keeping track of desires that are not useful to the task at hand, and find more desires that are useful to report on.

It influences behavior in the following ways:

- **In Range**: accurate sensing that results in goals reached efficiently, and crises averted
- **Hypo**: lack of connection to the surrounding world, which typically results in inaccurate actions and decisions due to incorrect or lacking feedback
- **Hyper**: feasting on feedback instead of using it to achieve goals

## the mind as a system

The mind is most efficient when all three elements are in correct proportions or ratios to each other. The rational element steers, the sensing element provides feedback used to guide the steering, and the executive element actuates the system. Many designs found in nature mirror the same basic arrangement:

- Bacteria sense the concentration of chemicals in their medium by using chemo-receptor proteins. Receptors dispatch messenger proteins when they bind to a stimuli molecule, and the messengers bind to flagellar motors that actuate movement. This causes the motors to face whichever direction gets the strongest signal.
- Complex organisms like water-bears (tardigrades) need a system of connected nerve cells (cerebral ganglia) that take multiple inputs and wire them through to multiple outputs. There are enough cells in the ganglia to create a surface for laying out several large graphs of nodes, much like authoring materials in Blender, composition diagrams in XXX, or racks with patch cables in a modular synth.
- Some of the largest animals on Earth maintain the same structure: one or more sensory elements, a decision-making element consisting of many information processing cells that can be formed into interconnected networks, and finally muscles that actuate movement.

This 3-piece pattern repeats at both micro- and macro-levels because mapping sensory input into activity is a very common task for any living organism.

> Any system that models a mathematical function by taking inputs, making connections, and producing outputs will necessarily have to be composed of sensing, thinking, and actuation parts.