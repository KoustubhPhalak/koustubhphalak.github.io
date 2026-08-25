"use strict";

const TWO_PI = 2 * Math.PI;

function normalizeAngle(value, period) {
  let x = value % period;
  if (x < 0) x += period;
  return x;
}

// Energy convention matches the page's explicit upper-triangular QUBO:
// E(x) = offset + sum_i Q[i][i] x_i + sum_{i<j} Q[i][j] x_i x_j.
function precomputeEnergies(Q, offset) {
  const n = Q.length;
  const dimension = 2 ** n;
  const energies = new Float64Array(dimension);

  const diagonal = new Float64Array(n);
  const pairs = [];
  for (let i = 0; i < n; i += 1) {
    diagonal[i] = Q[i][i];
    for (let j = i + 1; j < n; j += 1) {
      if (Q[i][j] !== 0) pairs.push([i, j, Q[i][j]]);
    }
  }

  let groundEnergy = Number.POSITIVE_INFINITY;
  let groundStateCount = 0;

  for (let state = 0; state < dimension; state += 1) {
    let energy = offset;
    for (let i = 0; i < n; i += 1) {
      if ((state & (2 ** i)) !== 0) energy += diagonal[i];
    }
    for (const [i, j, coefficient] of pairs) {
      if ((state & (2 ** i)) !== 0 && (state & (2 ** j)) !== 0) {
        energy += coefficient;
      }
    }
    energies[state] = energy;

    if (energy < groundEnergy - 1e-9) {
      groundEnergy = energy;
      groundStateCount = 1;
    } else if (Math.abs(energy - groundEnergy) < 1e-9) {
      groundStateCount += 1;
    }
  }

  return { energies, groundEnergy, groundStateCount };
}

function createSimulator(energies, n) {
  const dimension = energies.length;
  const amplitude = 1 / Math.sqrt(dimension);
  const real = new Float64Array(dimension);
  const imag = new Float64Array(dimension);
  const probabilities = new Float64Array(dimension);

  function run(gamma, beta, keepProbabilities = false) {
    real.fill(amplitude);
    imag.fill(0);

    // QAOA cost layer U_C(gamma) = exp(-i gamma H_C).
    // H_C is diagonal in the computational basis, and each basis state's
    // eigenvalue is exactly its QUBO energy.
    const phaseCache = new Map();
    for (let state = 0; state < dimension; state += 1) {
      const energy = energies[state];
      let phase = phaseCache.get(energy);
      if (!phase) {
        const angle = gamma * energy;
        phase = [Math.cos(angle), Math.sin(angle)];
        phaseCache.set(energy, phase);
      }
      real[state] = amplitude * phase[0];
      imag[state] = -amplitude * phase[1];
    }

    // Mixer layer U_B(beta) = exp(-i beta sum_i X_i), applied as a product
    // of single-qubit exp(-i beta X) rotations.
    const c = Math.cos(beta);
    const s = Math.sin(beta);
    for (let qubit = 0; qubit < n; qubit += 1) {
      const stride = 2 ** qubit;
      const block = stride * 2;
      for (let start = 0; start < dimension; start += block) {
        const end = start + stride;
        for (let a = start; a < end; a += 1) {
          const b = a + stride;
          const ar = real[a];
          const ai = imag[a];
          const br = real[b];
          const bi = imag[b];

          real[a] = c * ar + s * bi;
          imag[a] = c * ai - s * br;
          real[b] = c * br + s * ai;
          imag[b] = c * bi - s * ar;
        }
      }
    }

    let expectation = 0;
    for (let state = 0; state < dimension; state += 1) {
      const p = real[state] * real[state] + imag[state] * imag[state];
      probabilities[state] = p;
      expectation += p * energies[state];
    }

    return keepProbabilities
      ? { expectation, probabilities: Float64Array.from(probabilities) }
      : { expectation };
  }

  return { run };
}

function optimizeP1(simulator) {
  let best = { expectation: Number.POSITIVE_INFINITY, gamma: 0, beta: 0 };

  // A deterministic coarse search makes the demo reproducible and avoids a
  // dependency on an external numerical optimizer.
  const gammaSteps = 12;
  const betaSteps = 8;
  for (let gi = 0; gi < gammaSteps; gi += 1) {
    const gamma = TWO_PI * gi / gammaSteps;
    for (let bi = 0; bi < betaSteps; bi += 1) {
      const beta = Math.PI * bi / betaSteps;
      const result = simulator.run(gamma, beta);
      if (result.expectation < best.expectation) {
        best = { expectation: result.expectation, gamma, beta };
      }
    }
    if (gi % 3 === 0) {
      self.postMessage({
        type: "progress",
        message: `Optimizing QAOA angles… coarse search ${gi + 1}/${gammaSteps}`,
      });
    }
  }

  let gammaRadius = TWO_PI / gammaSteps;
  let betaRadius = Math.PI / betaSteps;

  // Local grid refinement around the best coarse point.
  for (let round = 0; round < 3; round += 1) {
    let localBest = best;
    for (let dg = -2; dg <= 2; dg += 1) {
      for (let db = -2; db <= 2; db += 1) {
        const gamma = normalizeAngle(best.gamma + (dg / 2) * gammaRadius, TWO_PI);
        const beta = normalizeAngle(best.beta + (db / 2) * betaRadius, Math.PI);
        const result = simulator.run(gamma, beta);
        if (result.expectation < localBest.expectation) {
          localBest = { expectation: result.expectation, gamma, beta };
        }
      }
    }
    best = localBest;
    gammaRadius /= 2;
    betaRadius /= 2;
    self.postMessage({
      type: "progress",
      message: `Refining QAOA angles… ${round + 1}/3`,
    });
  }

  return best;
}

function sampleDistribution(probabilities, energies, shots, n) {
  const dimension = probabilities.length;
  const cumulative = new Float64Array(dimension);
  let total = 0;
  for (let i = 0; i < dimension; i += 1) {
    total += probabilities[i];
    cumulative[i] = total;
  }
  cumulative[dimension - 1] = 1;

  const counts = new Map();

  for (let shot = 0; shot < shots; shot += 1) {
    const target = Math.random();
    let lo = 0;
    let hi = dimension - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (target <= cumulative[mid]) hi = mid;
      else lo = mid + 1;
    }

    const state = lo;
    counts.set(state, (counts.get(state) || 0) + 1);
  }

  let bestSampleState = 0;
  let bestSampleEnergy = Number.POSITIVE_INFINITY;
  let bestSampleCount = -1;
  for (const [state, count] of counts.entries()) {
    const energy = energies[state];
    if (energy < bestSampleEnergy - 1e-9 ||
        (Math.abs(energy - bestSampleEnergy) < 1e-9 && count > bestSampleCount)) {
      bestSampleEnergy = energy;
      bestSampleState = state;
      bestSampleCount = count;
    }
  }

  const bitstringFor = (state) => Array.from(
    { length: n },
    (_, index) => ((state & (2 ** index)) !== 0 ? "1" : "0")
  ).join("");

  const topSamples = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([state, count]) => ({
      state,
      bitstring: bitstringFor(state),
      count,
      energy: energies[state],
    }));

  return { bestSampleState, bestSampleEnergy, topSamples };
}

function solveQaoa({ Q, offset, shots = 2048, depth = 1 }) {
  if (depth !== 1) throw new Error("This browser demo currently implements QAOA depth p=1.");

  const n = Q.length;
  if (n === 0) {
    return {
      exactGroundEnergy: 0,
      groundStateCount: 1,
      expectation: 0,
      gamma: 0,
      beta: 0,
      groundProbability: 1,
      bestSampleState: 0,
      bestSampleEnergy: 0,
      topSamples: [{ state: 0, bitstring: "0", count: shots, energy: 0 }],
      shots,
    };
  }
  if (n > 20) throw new Error(`Refusing a ${n}-qubit browser statevector. Generate a smaller puzzle.`);

  self.postMessage({ type: "progress", message: `Enumerating the ${2 ** n} exact QUBO basis energies…` });
  const { energies, groundEnergy, groundStateCount } = precomputeEnergies(Q, offset);

  self.postMessage({ type: "progress", message: `Simulating a ${n}-qubit p=1 QAOA statevector…` });
  const simulator = createSimulator(energies, n);
  const optimum = optimizeP1(simulator);
  const finalState = simulator.run(optimum.gamma, optimum.beta, true);

  let groundProbability = 0;
  for (let state = 0; state < energies.length; state += 1) {
    if (Math.abs(energies[state] - groundEnergy) < 1e-9) {
      groundProbability += finalState.probabilities[state];
    }
  }

  self.postMessage({ type: "progress", message: `Sampling ${shots} measurements from the QAOA statevector…` });
  const sampled = sampleDistribution(finalState.probabilities, energies, shots, n);

  return {
    exactGroundEnergy: groundEnergy,
    groundStateCount,
    expectation: optimum.expectation,
    gamma: optimum.gamma,
    beta: optimum.beta,
    groundProbability,
    bestSampleState: sampled.bestSampleState,
    bestSampleEnergy: sampled.bestSampleEnergy,
    topSamples: sampled.topSamples,
    shots,
  };
}

self.onmessage = (event) => {
  if (!event.data || event.data.type !== "solve") return;
  try {
    const result = solveQaoa(event.data.payload);
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
  }
};
