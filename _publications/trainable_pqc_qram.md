---
title: "Trainable PQC-based QRAM for Quantum Storage"
collection: publications
permalink: /publication/2023-05-22-trainable-pqc-qram
# excerpt: ''
date: 2023-05-22
venue: 'IEEE Access'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, Junde Li, and Swaroop Ghosh. "Trainable PQC-based QRAM for Quantum Storage." IEEE Access (2023).'
---

[Download paper here](http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf)

Quantum Machine Learning (QML) is a new domain of Machine Learning (ML) and Quantum Computing (QC) that uses a trainable Variational Quantum Circuit (VQC) to solve various learning problems. Classical data is transformed to the quantum Hilbert space using an embedding scheme and the VQC performs quantum operations on this transformed quantum data using parametric quantum gates. In this work, we present a new embedding scheme using Quantum Random Access Memory (QRAM) that takes address as input, and gives data as the output similar to a classical Random Access Memory (RAM). We propose a basic circuit-based QRAM architecture and its application in, (a) storage for ML usage and, (b) storage of binary data. For ML, we store images of digits dataset into the QRAM and perform binary classification using a Quantum Neural Network (QNN). We observe that QNN driven by the proposed QRAM converges faster (at 6th epoch) with 100% classification accuracy compared to QNN with normal embedding and classical Fully Connected Neural Network (FCNN) setups which converge with same accuracy at around 10th and 15th epochs, respectively. We obtain ≈63% classification accuracy on real hardware from IBM. For storage of binary data, we measure Hamming Distance (HD) and percentage correct predictions for quality evaluation of the proposed QRAM. We observe that the HD and percentage correct predictions worsens as the number of address lines increases. We propose two techniques to improve the QRAM accuracy namely, (i) clustering of raw data and allocating one QRAM per cluster and, (ii) bit splitting to divide wider data into smaller chunks and allocating one QRAM per split. Clustering provides best results by improving the HD for 9-address QRAM by ≈1.95X than pure QRAM and ≈1.74X improvement compared to bit-split (which provides ≈1.11X improvement than pure QRAM).