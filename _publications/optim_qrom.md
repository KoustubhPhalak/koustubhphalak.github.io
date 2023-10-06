---
title: "Optimization of quantum read-only memory circuits"
collection: publications
permalink: /publication/2022-04-06-qec-dummies
# excerpt: ''
date: 2022-04-06
venue: 'ICCD'
# paperurl: 'http://koustubhphalak.github.io/files/Trainable_PQC-Based_QRAM_for_Quantum_Storage.pdf'
citation: 'Phalak, Koustubh, et al. "Optimization of Quantum Read-Only Memory Circuits." 2022 IEEE 40th International Conference on Computer Design (ICCD). IEEE Computer Society, 2022.'
---

[Download paper here](http://koustubhphalak.github.io/files/Optimization_Of_QROM_Circuits.pdf)

Quantum computing is a rapidly expanding field with applications ranging from optimization all the way to complex machine learning tasks. Quantum memories, while lacking in practical quantum computers, have the potential to bring quantum advantage. In quantum machine learning applications for example, a quantum memory can simplify the data loading process and potentially accelerate the learning task. Quantum memory can also store intermediate quantum state of qubits that can be reused for computation. However, the depth, gate count and compilation time of quantum memories such as, Quantum Read Only Memory (QROM) scale exponentially with the number of address lines making them impractical in state-of-the-art Noisy Intermediate-Scale Quantum (NISQ) computers beyond 4-bit addresses. In this paper, we propose techniques such as, predecoding logic and qubit reset to reduce the depth and gate count of QROM circuits to target wider address ranges such as, 8-bits. The proposed approach reduces the number of gates and depth count by at least 2X compared to the naive implementation at only 36% qubit overhead. A reduction in circuit depth and gate count as high as 75X and compilation time by 85X at the cost of a maximum of 2.28X qubit overhead is observed. Experimentally, the fidelity with the proposed predecoding circuit compared to existing optimization approach is also higher (as much as 73% compared to 40.8%) under reduced error rates.