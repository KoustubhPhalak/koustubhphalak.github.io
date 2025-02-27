---
title: "Optimizing Quantum Embedding using Genetic Algorithm for QML Applications"
collection: publications
permalink: /publication/2024-04-03-non-param-greedy
# excerpt: ''
date: 2024-11-29
venue: 'arXiv preprint arXiv:2412.00286'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, Archisman Ghosh, and Swaroop Ghosh. "Optimizing Quantum Embedding using Genetic Algorithm for QML Applications." arXiv preprint arXiv:2412.00286 (2024).'
---

[Download paper here](http://koustubhphalak.github.io/files/Optimizing_Quantum_Embedding_using_Genetic_Algo_for_QML_Apps.pdf)

Quantum Embeddings (QE) are essential for loading classical data into quantum systems for Quantum Machine Learning (QML). The performance of QML algorithms depends on the type of QE and how features are mapped to qubits. Traditionally, the optimal embedding is found through optimization, but we propose framing it as a search problem instead. In this work, we use a Genetic Algorithm (GA) to search for the best feature-to-qubit mapping. Experiments on the MNIST and Tiny ImageNet datasets show that GA outperforms random feature-to-qubit mappings, achieving 0.33-3.33 (MNIST) and 0.5-3.36 (Tiny ImageNet) higher fitness scores, with up to 15% (MNIST) and 8.8% (Tiny ImageNet) reduced runtime. The GA approach is scalable with both dataset size and qubit count. Compared to existing methods like Quantum Embedding Kernel (QEK), QAOA-based embedding, and QRAC, GA shows improvements of 1.003X, 1.03X, and 1.06X, respectively.