---
title: "Machine Learning"
sequence: "101"
---

## Three Main Ways of Learning

Among the different machine learning approaches,
there are three main ways of learning,
as shown in the following list:

- Supervised Learning
- Unsupervised Learning
- Reinforcement Learning

### Supervised Learning

Given a set of example inputs `X`, and their outcomes `Y`,
**supervised learning** aims to learn a general mapping function `f`,
which transforms inputs into outputs, as `f:(X,Y)`.

An example of supervised learning is credit card fraud detection,
where the learning algorithm is presented with credit card transactions (matrix `X`)
marked as normal or suspicious (vector `Y`).
The learning algorithm produces a decision model
that marks unseen transactions as normal or suspicious (this is the `f` function).

```text
举例：信用卡诈骗检测
```

### Unsupervised Learning

In contrast, **unsupervised learning algorithms** do not assume given outcome labels,
as they focus on learning the structure of the data, such as grouping similar inputs into clusters.

**Unsupervised learning can, therefore, discover hidden patterns in the data.**
An example of unsupervised learning is an item-based recommendation system,
where the learning algorithm discovers similar items bought together;
for example, people who bought book A also bought book B.

### Reinforcement Learning

Reinforcement learning addresses the learning process from a completely different angle.

It assumes that an **agent**, which can be a robot, bot, or computer program,
interacts with a **dynamic environment** to achieve a specific **goal**.

```text
keyword: agent
```

The **environment** is described with a set of **states** and
the agent can take different actions to move from one state to another.
Some states are marked as **goal states**,
and if the agent achieves this state, it receives a large reward.
In other states, the reward is smaller, non-existent, or even negative.

```text
keyword: environment --> state --> goal state
```

The **goal** of reinforcement learning is to find an optimal policy or a mapping function
that specifies the action to take in each of the states,
without a teacher explicitly telling whether this leads to the goal state or not.

```text
keyword: goal
```

An example of reinforcement learning would be a program for driving a vehicle,
where the states correspond to the driving conditions,
for example, current speed, road segment information, surrounding traffic, speed limits, and obstacles on the road;
and the actions could be driving maneuvers, such as turn left or right, stop, accelerate, and continue.
The learning algorithm produces a policy that specifies the action
that is to be taken in specific configurations of driving conditions.

```text
示例：驾驶汽车
```

## Applied machine learning workflow

A typical workflow in applied machine learning applications consists of answering a series of questions
that can be summarized in the following steps:

```text
Data & Problem Definition --> Data Collection --> Data Preprocessing --> Data analysis and modeling --> Evaluation
```

### Data and problem definition

The first step is to ask interesting questions, such as:

- What is the problem you are trying to solve?
- Why is it important?
- Which format of result answers your question?
- Is this a simple yes/no answer?


### Data collection

Once you have a problem to tackle, you will need the data.  
Ask yourself what kind of data will help you answer the question.

- Can you get the data from the available sources?
- Will you have to combine multiple sources?
- Do you have to generate the data?
- Are there any sampling biases?
- How much data will be required?

### Data preprocessing

The first data preprocessing task is data cleaning.
Some of the examples include

- **filling missing values**,
- **smoothing noisy data**,
- **removing outliers**, and
- **resolving consistencies**.

This is usually followed by **integration of multiple data sources** and
**data transformation to a specific range (normalization)**,
to **value bins (discretized intervals)**,
and to **reduce the number of dimensions**.

### Data analysis and modelling

Data analysis and modelling includes
unsupervised and supervised machine learning, statistical inference, and prediction.

A wide variety of machine learning algorithms are available,
including k-nearest neighbors, Naive Bayes classifier, decision trees, Support Vector Machines (SVMs),
logistic regression, k-means, and so on.

The method to be deployed depends on the problem definition, and the type of collected data.
The final product of this step is a model inferred from the data.

### Evaluation

The last step is devoted to model assessment.
The main issue that the models built with machine learning face is how well they model the underlying data;
for example, if a model is too specific, or it overfits to the data used for training,
it is quite possible that it will not perform well on new data.

The model can be too generic, meaning that it underfits the training data.
For example, when asked how the weather is in California, it always answers sunny,
which is indeed correct most of the time.
However, such a model is not really useful for making valid predictions.

The goal of this step is to correctly evaluate the model and
make sure it will work on new data as well.

Evaluation methods include

- **separate test** and
- **train sets**,
- **cross-validation**, and
- **leave-one-out cross-validation**.
