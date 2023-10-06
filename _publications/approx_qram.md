---
title: "Approximate quantum random access memory architectures"
collection: publications
permalink: /publication/2022-10-24-qec-dummies
# excerpt: ''
date: 2022-10-24
venue: 'arXiv preprint arXiv:2210.14804'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, Junde Li, and Swaroop Ghosh. "Approximate quantum random access memory architectures." arXiv preprint arXiv:2210.14804 (2022).'
---

[Download paper here](http://koustubhphalak.github.io/files/Approx_QRAM_Architectures.pdf)

Quantum supremacy in many applications using well-known quantum algorithms rely on availability of data in quantum format. Quantum Random Access Memory (QRAM), an equivalent of classical Random Access Memory (RAM), fulfills this requirement. However, the existing QRAM proposals either require qutrit technology and/or incur access challenges. Therefore, there is a need for a practically feasible QRAM architecture for loading data.  We propose an approximate Parametric Quantum Circuit (PQC) based QRAM which takes address lines as input and gives out the corresponding data in these address lines as the output. We present two applications of the proposed PQC-based QRAM namely, storage of binary data and storage of machine learning (ML) dataset for classification. For the machine learning task, we perform binary classification using three different setups, (a) QNN with QRAM (QRAM + QNN), (b) QNN with normal data embedding and (c) Fully Connected Neural Network (FCNN). We show that QRAM + QNN converges (with 100\% classification accuracy) faster i.e., by $6^{th}$ epoch, compared to the other two setups which converge at around $10^{th}$ and $15^{th}$ epochs. The loss for QRAM + QNN (0.53) is less than FCNN setup (0.89) and comparable to QNN with normal embedding (0.48). For the storage of binary data, we evaluate Hamming Distance (HD) and percentage correct prediction metrics to quantify the performance. We observe an increase in HD from 0 to 3.97 and decrease in percentage of correct predictions from 100$\%$ to 0.58$\%$ as we increase the number of address and data lines from 2 to 9. We propose agglomerative clustering of data as a pre-processing step before training the QRAM to improve the HD i.e., from 3.97 to 2.17 and increase the percentage correct predictions to 10.1\% from 0.58\% till 9 address lines.