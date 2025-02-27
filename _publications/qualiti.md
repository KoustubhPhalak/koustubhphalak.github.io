---
title: "QuaLITi:Quantum Machine Learning Hardware Selection for Inferencing with Top-Tier Performance"
collection: publications
permalink: /publication/2024-05-18-qualiti
# excerpt: ''
date: 2024-05-18
venue: 'arXiv preprint arXiv:2405.11194'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, and Swaroop Ghosh. "QuaLITi: Quantum Machine Learning Hardware Selection for Inferencing with Top-Tier Performance." arXiv preprint arXiv:2405.11194 (2024).'
---

[Download paper here](http://koustubhphalak.github.io/files/QuaLITi_QML_HW_Selection_for_Inferencing_with_Top_Tier_Performance.pdf)

Quantum Machine Learning (QML) is an accelerating field of study that leverages the principles of quantum computing to enhance and innovate within machine learning methodologies. However, Noisy Intermediate-Scale Quantum (NISQ) computers suffer from noise that corrupts the quantum states of the qubits and affects the training and inferencing accuracy. Furthermore, quantum computers have long access queues. A single execution with a pre-defined number of shots can take hours just to reach the top of the wait queue, which is especially disadvantageous to Quantum Machine Learning (QML) algorithms that are iterative in nature. Many vendors provide access to a suite of quantum hardware with varied qubit technologies, number of qubits, coupling architectures, and noise characteristics. However, present QML algorithms do not use them for the training procedure and often rely on local noiseless/noisy simulators due to cost and training timing overhead on real hardware. Additionally, inferencing is generally performed on reduced datasets with fewer datapoints. Taking these constraints into account, we perform a study to maximize the inferencing performance of QML workloads based on the choice of hardware selection. Specifically, we perform a detailed analysis of quantum classifiers (both training and inference through the lens of hardware queue wait times) on Iris and reduced Digits datasets under noise and varied conditions such as different hardware and coupling maps. We show that using multiple readily available hardware for training rather than relying on a single hardware, especially if it has a long queue depth of pending jobs, can lead to a performance impact of only 3-4% while providing up to 45X reduction in training wait time.