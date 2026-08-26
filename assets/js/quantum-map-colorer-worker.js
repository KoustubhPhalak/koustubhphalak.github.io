"use strict";

const TWO_PI = 2 * Math.PI;
const DEPTH = 2;

function normalizeAngle(value, period) {
  let x = value % period;
  if (x < 0) x += period;
  return x;
}

// Upper-triangular QUBO convention:
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
      if (Math.abs(Q[i][j]) > 1e-12) pairs.push([i, j, Q[i][j]]);
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
      if ((state & (2 ** i)) !== 0 && (state & (2 ** j)) !== 0) energy += coefficient;
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
  const initial = 1 / Math.sqrt(dimension);
  const real = new Float64Array(dimension);
  const imag = new Float64Array(dimension);
  const probabilities = new Float64Array(dimension);

  function applyCost(gamma) {
    for (let state = 0; state < dimension; state += 1) {
      const angle = gamma * energies[state];
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const r = real[state];
      const im = imag[state];
      // (r + i im) exp(-i angle)
      real[state] = r * c + im * s;
      imag[state] = im * c - r * s;
    }
  }

  function applyMixer(beta) {
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
  }

  function run(gammas, betas, keepProbabilities = false) {
    real.fill(initial);
    imag.fill(0);

    for (let layer = 0; layer < DEPTH; layer += 1) {
      applyCost(gammas[layer]);
      applyMixer(betas[layer]);
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

function halton(index, base) {
  let result = 0;
  let fraction = 1;
  let i = index;
  while (i > 0) {
    fraction /= base;
    result += fraction * (i % base);
    i = Math.floor(i / base);
  }
  return result;
}

function optimizeP2(simulator) {
  let best = {
    expectation: Number.POSITIVE_INFINITY,
    gammas: [0, 0],
    betas: [0, 0],
  };

  // Four-dimensional deterministic low-discrepancy search. This is much cheaper
  // than a Cartesian 4-D grid, while being reproducible across page loads.
  const candidates = 250;
  for (let i = 1; i <= candidates; i += 1) {
    const gammas = [TWO_PI * halton(i, 2), TWO_PI * halton(i, 3)];
    const betas = [Math.PI * halton(i, 5), Math.PI * halton(i, 7)];
    const result = simulator.run(gammas, betas);
    if (result.expectation < best.expectation) {
      best = { expectation: result.expectation, gammas, betas };
    }
    if (i % 50 === 0) {
      self.postMessage({ type: "progress", message: `Optimizing p=2 QAOA angles… ${i}/${candidates} candidates` });
    }
  }

  let radii = [0.5, 0.5, 0.25, 0.25];
  for (let round = 0; round < 4; round += 1) {
    let improved = true;
    while (improved) {
      improved = false;
      for (let dimension = 0; dimension < 4; dimension += 1) {
        for (const sign of [-1, 1]) {
          const gammas = [...best.gammas];
          const betas = [...best.betas];
          if (dimension < 2) {
            gammas[dimension] = normalizeAngle(gammas[dimension] + sign * radii[dimension], TWO_PI);
          } else {
            const betaIndex = dimension - 2;
            betas[betaIndex] = normalizeAngle(betas[betaIndex] + sign * radii[dimension], Math.PI);
          }
          const result = simulator.run(gammas, betas);
          if (result.expectation < best.expectation - 1e-12) {
            best = { expectation: result.expectation, gammas, betas };
            improved = true;
          }
        }
      }
    }
    radii = radii.map((r) => r / 2);
    self.postMessage({ type: "progress", message: `Refining p=2 angles… ${round + 1}/4` });
  }

  return best;
}

function sampleDistribution(probabilities, energies, shots, n) {
  const cumulative = new Float64Array(probabilities.length);
  let total = 0;
  for (let i = 0; i < probabilities.length; i += 1) {
    total += probabilities[i];
    cumulative[i] = total;
  }
  cumulative[cumulative.length - 1] = 1;

  const counts = new Map();
  for (let shot = 0; shot < shots; shot += 1) {
    const target = Math.random();
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (target <= cumulative[mid]) hi = mid;
      else lo = mid + 1;
    }
    counts.set(lo, (counts.get(lo) || 0) + 1);
  }

  let bestSampleState = 0;
  let bestSampleEnergy = Number.POSITIVE_INFINITY;
  let bestSampleCount = -1;
  for (const [state, count] of counts.entries()) {
    const energy = energies[state];
    if (energy < bestSampleEnergy - 1e-9 ||
        (Math.abs(energy - bestSampleEnergy) < 1e-9 && count > bestSampleCount)) {
      bestSampleState = state;
      bestSampleEnergy = energy;
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

function solveQaoa({ Q, offset, shots = 2048 }) {
  const n = Q.length;
  if (n > 18) throw new Error(`Refusing a ${n}-qubit browser statevector.`);

  self.postMessage({ type: "progress", message: `Enumerating ${2 ** n} QUBO basis energies for the exact reference…` });
  const { energies, groundEnergy, groundStateCount } = precomputeEnergies(Q, offset);

  self.postMessage({ type: "progress", message: `Simulating a ${n}-qubit p=2 QAOA statevector…` });
  const simulator = createSimulator(energies, n);
  const optimum = optimizeP2(simulator);
  const finalState = simulator.run(optimum.gammas, optimum.betas, true);

  let groundProbability = 0;
  for (let state = 0; state < energies.length; state += 1) {
    if (Math.abs(energies[state] - groundEnergy) < 1e-9) groundProbability += finalState.probabilities[state];
  }

  self.postMessage({ type: "progress", message: `Sampling ${shots} measurements from the optimized QAOA statevector…` });
  const sampled = sampleDistribution(finalState.probabilities, energies, shots, n);

  return {
    exactGroundEnergy: groundEnergy,
    groundStateCount,
    expectation: optimum.expectation,
    gammas: optimum.gammas,
    betas: optimum.betas,
    groundProbability,
    bestSampleState: sampled.bestSampleState,
    bestSampleEnergy: sampled.bestSampleEnergy,
    topSamples: sampled.topSamples,
    shots,
    depth: DEPTH,
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
