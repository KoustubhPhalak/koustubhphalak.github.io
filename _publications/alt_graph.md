---
title: "AltGraph: Redesigning Quantum Circuits Using Generative Graph Models for Efficient Optimization"
collection: publications
permalink: /publication/2024-06-12-alt-graph
# excerpt: ''
date: 2024-06-12
venue: 'GLSVLSI'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Beaudoin, Collin, Koustubh Phalak, and Swaroop Ghosh. "AltGraph: Redesigning Quantum Circuits Using Generative Graph Models for Efficient Optimization." In Proceedings of the Great Lakes Symposium on VLSI 2024, pp. 44-49. 2024.'
---

[Download paper here](http://koustubhphalak.github.io/files/AltGraph_Redesigning_QCs_Using_Generative_Graph_Models_for_Efficient_Optimization.pdf)

Quantum circuit transformation aims to optimize circuits for depth, gate count, and compatibility with Noisy Intermediate Scale Quantum (NISQ) devices that suffer from various error sources. Prior methods use combinations of expert-defined rules and Reinforcement Learning (RL). We introduce AltGraph, a novel approach employing generative graph models to generate functionally equivalent quantum circuits using—specifically, Direct Acyclic Graph (DAG) Variational Autoencoder (D-VAE) variants (GRU and GCN) and Deep Generative Model for Graphs (DeepGMG). AltGraph perturbs the latent space to generate quantum circuits optimized for hardware coupling maps, reducing gate count by 37.55% and circuit depth by 37.75% post-transpiling, with 0.0074 Mean Squared Error (MSE) in the density matrix—outperforming state-of-the-art methods by 2.56%.