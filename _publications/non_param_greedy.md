---
title: "Non-parametric Greedy Optimization of Parametric Quantum Circuits"
collection: publications
permalink: /publication/2024-04-03-non-param-greedy
# excerpt: ''
date: 2024-04-03
venue: 'ISQED'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, and Swaroop Ghosh. "Non-parametric greedy optimization of parametric quantum circuits." In 2024 25th International Symposium on Quality Electronic Design (ISQED), pp. 1-7. IEEE, 2024.'
---

[Download paper here](http://koustubhphalak.github.io/files/Non_parametric_Greedy_Optimization_of_PQCs.pdf)

The use of Quantum Neural Networks (QNN) that are analogous to classical neural networks, has greatly increased in the past decade owing to the growing interest in the field of Quantum Machine Learning (QML). A QNN consists of three major components: (i) data loading/encoding circuit, (ii) Parametric Quantum Circuit (PQC), and (iii) measurement operations. Under ideal circumstances the PQC of the QNN trains well, however that may not be the case for training under quantum hardware due to presence of different kinds of noise. Deeper QNNs with high depths tend to degrade more in terms of performance compared to shallower networks. This work aims to reduce depth and gate count of PQCs by replacing parametric gates with their approximate fixed non-parametric representations. We propose a greedy algorithm to achieve this  such that the algorithm minimizes a distance metric based on unitary transformation matrix of original parametric gate and new set of non-parametric gates. From this greedy optimization followed by a few epochs of re-training, we observe roughly 14% reduction in depth and 48% reduction in gate count at the cost of 3.33% reduction in inferencing accuracy. Similar results
 are observed for a different dataset as well with different PQC structure.