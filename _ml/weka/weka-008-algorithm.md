---
title: "Weka Machine Learning Algorithm"
sequence: "108"
---

Weka presents you with a list of machine learning algorithms to choose from.
They are divided into a number of main groups:

- **bayes**: Algorithms that use Bayes Theorem in some core way, like Naive Bayes.
- **function**: Algorithms that estimate a function, like Linear Regression.
- **lazy**: Algorithms that use lazy learning, like k-Nearest Neighbors.
- **meta**: Algorithms that use or combine **multiple algorithms**, like Ensembles.
- **misc**: Implementations that do not neatly fit into the other groups, like running a saved model.
- **rules**: Algorithms that use rules, like One Rule.
- **trees**: Algorithms that use decision trees, like Random Forest.

Top 10 machine learning algorithms:

Linear algorithms **assume** that the predicted attribute is a **linear combination** of the input attributes.

- Linear Machine Learning Algorithms
    - Linear Regression: `function.LinearRegression`
    - Logistic Regression: `function.Logistic`

Nonlinear algorithms **do not make strong assumptions** about the relationship
between the input attributes and the output attribute being predicted.

- Nonlinear Machine Learning Algorithms
    - Naive Bayes: `bayes.NaiveBayes`
    - Decision Tree (specifically the C4.5 variety): `trees.J48`
    - k-Nearest Neighbors (also called **KNN**): `lazy.IBk`
    - Support Vector Machines (also called **SVM**): `functions.SMO`
    - Neural Network: `functions.MultilayerPerceptron`

Ensemble methods **combine the predictions from multiple models** in order to make more robust predictions.

- Ensemble Machine Learning Algorithms
    - Random Forest: `trees.RandomForest`
    - Bootstrap Aggregation (also called Bagging): `meta.Bagging`
    - Stacked Aggregation (also called Stacking or Blending): `meta.Stacking`






