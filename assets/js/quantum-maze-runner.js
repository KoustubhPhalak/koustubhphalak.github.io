(() => {
  "use strict";

  const COARSE_SIZE = 4;
  const GRID_SIZE = (2 * COARSE_SIZE) - 1; // 7x7 rendered maze
  const MIN_ROUTE_LENGTH = 16;
  const DIRS = [
    { dr: -1, dc: 0, label: "N", opposite: 2 },
    { dr: 0, dc: 1, label: "E", opposite: 3 },
    { dr: 1, dc: 0, label: "S", opposite: 0 },
    { dr: 0, dc: -1, label: "W", opposite: 1 },
  ];
  const START = { r: 0, c: 0 };
  const EXIT = { r: GRID_SIZE - 1, c: GRID_SIZE - 1 };

  function secureRandomUnit() {
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] / 4294967296;
    }
    return Math.random();
  }

  function randomInt(maxExclusive) {
    return Math.floor(secureRandomUnit() * maxExclusive);
  }

  function randomChoice(items) {
    return items[randomInt(items.length)];
  }

  function keyOf(r, c) {
    return `${r},${c}`;
  }

  function isInside(r, c) {
    return r >= 0 && c >= 0 && r < GRID_SIZE && c < GRID_SIZE;
  }

  // A perfect maze is built as a randomized DFS spanning tree on a 4x4 coarse grid,
  // then expanded into a 7x7 wall/passage grid. Because the coarse graph is a tree,
  // Start -> Exit has exactly one simple route.
  function generatePerfectMazeOnce() {
    const open = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

    for (let r = 0; r < COARSE_SIZE; r += 1) {
      for (let c = 0; c < COARSE_SIZE; c += 1) {
        open[2 * r][2 * c] = true;
      }
    }

    const visited = Array.from({ length: COARSE_SIZE }, () => Array(COARSE_SIZE).fill(false));
    const stack = [[0, 0]];
    visited[0][0] = true;

    while (stack.length) {
      const [r, c] = stack[stack.length - 1];
      const options = [];

      for (const { dr, dc } of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nc >= 0 && nr < COARSE_SIZE && nc < COARSE_SIZE &&
          !visited[nr][nc]
        ) {
          options.push({ nr, nc, dr, dc });
        }
      }

      if (!options.length) {
        stack.pop();
        continue;
      }

      const { nr, nc, dr, dc } = randomChoice(options);
      // Open the corridor halfway between the two coarse cells.
      open[(2 * r) + dr][(2 * c) + dc] = true;
      visited[nr][nc] = true;
      stack.push([nr, nc]);
    }

    return open;
  }

  function shortestRouteLength(open) {
    const queue = [{ r: START.r, c: START.c, distance: 0 }];
    const seen = new Set([keyOf(START.r, START.c)]);
    let head = 0;

    while (head < queue.length) {
      const current = queue[head++];
      if (current.r === EXIT.r && current.c === EXIT.c) return current.distance;

      for (const { dr, dc } of DIRS) {
        const nr = current.r + dr;
        const nc = current.c + dc;
        const key = keyOf(nr, nc);
        if (
          isInside(nr, nc) && open[nr][nc] && !seen.has(key)
        ) {
          seen.add(key);
          queue.push({ r: nr, c: nc, distance: current.distance + 1 });
        }
      }
    }

    return Infinity;
  }

  function generateMaze() {
    // Most randomized perfect mazes meet this on the first couple of attempts.
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const open = generatePerfectMazeOnce();
      const routeLength = shortestRouteLength(open);
      if (routeLength >= MIN_ROUTE_LENGTH) return { open, routeLength };
    }

    const open = generatePerfectMazeOnce();
    return { open, routeLength: shortestRouteLength(open) };
  }

  function buildQuantumModel(open) {
    const positions = [];
    const positionIndex = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(-1));

    for (let r = 0; r < GRID_SIZE; r += 1) {
      for (let c = 0; c < GRID_SIZE; c += 1) {
        if (open[r][c]) {
          positionIndex[r][c] = positions.length;
          positions.push({ r, c });
        }
      }
    }

    const dimension = positions.length * 4;
    const shiftMap = new Int32Array(dimension);

    positions.forEach((position, p) => {
      DIRS.forEach((direction, d) => {
        const source = (p * 4) + d;
        const nr = position.r + direction.dr;
        const nc = position.c + direction.dc;

        if (isInside(nr, nc) && open[nr][nc]) {
          const neighbor = positionIndex[nr][nc];
          // Flip-flop shift: crossing an edge reverses the directed-edge coin label.
          shiftMap[source] = (neighbor * 4) + direction.opposite;
        } else {
          // A blocked direction is a fixed self-loop basis state. This keeps S unitary.
          shiftMap[source] = source;
        }
      });
    });

    // A unitary shift must be a permutation of basis states. Fail loudly if maze logic
    // ever changes in a way that violates that invariant.
    const destinations = new Set(shiftMap);
    if (destinations.size !== dimension) {
      throw new Error("Quantum maze shift is not unitary: shift map is not a permutation.");
    }

    return {
      positions,
      positionIndex,
      shiftMap,
      dimension,
      startIndex: positionIndex[START.r][START.c],
      exitIndex: positionIndex[EXIT.r][EXIT.c],
    };
  }

  function createQuantumStartState(model) {
    const state = new Float64Array(model.dimension);
    const base = model.startIndex * 4;
    // |Start> tensor (|N>+|E>+|S>+|W>)/2
    for (let d = 0; d < 4; d += 1) state[base + d] = 0.5;
    return state;
  }

  // Grover coin G4 = 2|s><s| - I on the four direction amplitudes at every position.
  function applyGroverCoin(state, positionCount) {
    for (let p = 0; p < positionCount; p += 1) {
      const base = p * 4;
      const mean = (
        state[base] + state[base + 1] + state[base + 2] + state[base + 3]
      ) / 4;

      for (let d = 0; d < 4; d += 1) {
        state[base + d] = (2 * mean) - state[base + d];
      }
    }
  }

  function applyUnitaryShift(state, shiftMap) {
    const shifted = new Float64Array(state.length);
    for (let i = 0; i < state.length; i += 1) {
      shifted[shiftMap[i]] = state[i];
    }
    return shifted;
  }

  function quantumWalkStep(state, model) {
    applyGroverCoin(state, model.positions.length);
    return applyUnitaryShift(state, model.shiftMap);
  }

  function positionProbabilities(state, model) {
    const probabilities = new Float64Array(model.positions.length);
    for (let p = 0; p < model.positions.length; p += 1) {
      const base = p * 4;
      let probability = 0;
      for (let d = 0; d < 4; d += 1) {
        const amplitude = state[base + d];
        probability += amplitude * amplitude;
      }
      probabilities[p] = probability;
    }
    return probabilities;
  }

  function stateNorm(state) {
    let norm = 0;
    for (let i = 0; i < state.length; i += 1) norm += state[i] * state[i];
    return norm;
  }

  function sampleQuantumBasis(state) {
    const draw = secureRandomUnit();
    let cumulative = 0;

    for (let i = 0; i < state.length; i += 1) {
      cumulative += state[i] * state[i];
      if (draw < cumulative || i === state.length - 1) return i;
    }
    return state.length - 1;
  }

  function classicalStep(position, open) {
    const direction = DIRS[randomInt(4)];
    const nr = position.r + direction.dr;
    const nc = position.c + direction.dc;

    if (isInside(nr, nc) && open[nr][nc]) {
      return { r: nr, c: nc, direction: direction.label, blocked: false };
    }

    return { r: position.r, c: position.c, direction: direction.label, blocked: true };
  }

  function initMazeRunner(root) {
    if (root.dataset.mazeReady === "true") return;
    root.dataset.mazeReady = "true";

    const classicalBoard = root.querySelector("[data-classical-maze]");
    const quantumBoard = root.querySelector("[data-quantum-maze]");
    const generateButton = root.querySelector("[data-maze-generate]");
    const resetButton = root.querySelector("[data-maze-reset]");
    const stepButton = root.querySelector("[data-maze-step-button]");
    const measureButton = root.querySelector("[data-maze-measure]");
    const stepElement = root.querySelector("[data-maze-step]");
    const shortestElement = root.querySelector("[data-maze-shortest]");
    const classicalPositionElement = root.querySelector("[data-classical-position]");
    const classicalVisitedElement = root.querySelector("[data-classical-visited]");
    const classicalHitElement = root.querySelector("[data-classical-hit]");
    const quantumExitElement = root.querySelector("[data-quantum-exit]");
    const quantumPeakElement = root.querySelector("[data-quantum-peak]");
    const quantumNormElement = root.querySelector("[data-quantum-norm]");
    const statusElement = root.querySelector("[data-maze-status]");

    if (!classicalBoard || !quantumBoard || !generateButton || !resetButton || !stepButton || !measureButton) {
      return;
    }

    let maze;
    let model;
    let quantumState;
    let classicalPosition;
    let classicalVisited;
    let classicalReachedAt = null;
    let stepCount = 0;
    let classicalCells = [];
    let quantumCells = [];

    function buildBoard(board, mode) {
      board.textContent = "";
      const cells = [];

      for (let r = 0; r < GRID_SIZE; r += 1) {
        for (let c = 0; c < GRID_SIZE; c += 1) {
          const cell = document.createElement("div");
          cell.className = "quantum-maze__cell";
          cell.setAttribute("role", "gridcell");
          cell.dataset.row = String(r);
          cell.dataset.col = String(c);

          if (!maze.open[r][c]) {
            cell.classList.add("quantum-maze__cell--wall");
            cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}: wall`);
          } else {
            cell.classList.add("quantum-maze__cell--open");
            const heat = document.createElement("span");
            heat.className = "quantum-maze__heat";
            heat.setAttribute("aria-hidden", "true");
            cell.appendChild(heat);

            const marker = document.createElement("span");
            marker.className = "quantum-maze__marker";
            cell.appendChild(marker);

            const probability = document.createElement("span");
            probability.className = "quantum-maze__probability";
            probability.setAttribute("aria-hidden", "true");
            cell.appendChild(probability);

            if (r === START.r && c === START.c) {
              cell.classList.add("quantum-maze__cell--start");
              cell.dataset.endpoint = "S";
            }
            if (r === EXIT.r && c === EXIT.c) {
              cell.classList.add("quantum-maze__cell--exit");
              cell.dataset.endpoint = "E";
            }

            cell.setAttribute(
              "aria-label",
              `Row ${r + 1}, column ${c + 1}: open${r === START.r && c === START.c ? ", Start" : ""}${r === EXIT.r && c === EXIT.c ? ", Exit" : ""}`
            );

            if (mode === "classical") heat.style.display = "none";
          }

          board.appendChild(cell);
          cells.push(cell);
        }
      }

      return cells;
    }

    function indexForCell(r, c) {
      return (r * GRID_SIZE) + c;
    }

    function renderClassical() {
      classicalCells.forEach((cell, flatIndex) => {
        const r = Math.floor(flatIndex / GRID_SIZE);
        const c = flatIndex % GRID_SIZE;
        if (!maze.open[r][c]) return;

        const here = r === classicalPosition.r && c === classicalPosition.c;
        const visited = classicalVisited.has(keyOf(r, c));
        const marker = cell.querySelector(".quantum-maze__marker");
        cell.classList.toggle("quantum-maze__cell--trail", visited && !here);
        cell.classList.toggle("quantum-maze__cell--classical", here);
        if (marker) marker.textContent = here ? "●" : "";
      });

      if (classicalPositionElement) {
        classicalPositionElement.textContent = (
          classicalPosition.r === EXIT.r && classicalPosition.c === EXIT.c
        ) ? "Exit" : `(${classicalPosition.r + 1}, ${classicalPosition.c + 1})`;
      }
      if (classicalVisitedElement) classicalVisitedElement.textContent = String(classicalVisited.size);
      if (classicalHitElement) {
        classicalHitElement.textContent = classicalReachedAt === null ? "Not yet" : `Step ${classicalReachedAt}`;
      }
    }

    function renderQuantum() {
      const probabilities = positionProbabilities(quantumState, model);
      let peak = 0;

      model.positions.forEach((position, p) => {
        const probability = probabilities[p];
        peak = Math.max(peak, probability);
        const cell = quantumCells[indexForCell(position.r, position.c)];
        const heat = cell.querySelector(".quantum-maze__heat");
        const label = cell.querySelector(".quantum-maze__probability");

        if (heat) {
          // sqrt scaling keeps low-but-real probability visible without saturating peaks.
          heat.style.opacity = String(Math.min(0.88, Math.sqrt(probability) * 1.25));
        }
        if (label) {
          label.textContent = probability >= 0.0125 ? `${(probability * 100).toFixed(probability >= 0.1 ? 0 : 1)}%` : "";
        }
        cell.setAttribute(
          "aria-label",
          `Row ${position.r + 1}, column ${position.c + 1}: quantum position probability ${(probability * 100).toFixed(2)} percent${position.r === START.r && position.c === START.c ? ", Start" : ""}${position.r === EXIT.r && position.c === EXIT.c ? ", Exit" : ""}`
        );
      });

      const exitProbability = probabilities[model.exitIndex];
      if (quantumExitElement) quantumExitElement.textContent = `${(exitProbability * 100).toFixed(2)}%`;
      if (quantumPeakElement) quantumPeakElement.textContent = `${(peak * 100).toFixed(2)}%`;
      if (quantumNormElement) quantumNormElement.textContent = stateNorm(quantumState).toFixed(6);
    }

    function renderAll() {
      if (stepElement) stepElement.textContent = String(stepCount);
      if (shortestElement) shortestElement.textContent = `${maze.routeLength} steps`;
      renderClassical();
      renderQuantum();
    }

    function resetWalkers() {
      quantumState = createQuantumStartState(model);
      classicalPosition = { r: START.r, c: START.c };
      classicalVisited = new Set([keyOf(START.r, START.c)]);
      classicalReachedAt = null;
      stepCount = 0;
      if (statusElement) {
        statusElement.textContent = "Both walkers reset to Start. The quantum coin begins in an equal four-direction superposition.";
      }
      renderAll();
    }

    function newMaze() {
      maze = generateMaze();
      model = buildQuantumModel(maze.open);
      classicalCells = buildBoard(classicalBoard, "classical");
      quantumCells = buildBoard(quantumBoard, "quantum");
      resetWalkers();
      if (statusElement) {
        statusElement.textContent = `New perfect maze generated. Its unique shortest route is ${maze.routeLength} steps; neither walker is given that route.`;
      }
    }

    function stepBoth() {
      stepCount += 1;

      if (classicalReachedAt === null) {
        const move = classicalStep(classicalPosition, maze.open);
        classicalPosition = { r: move.r, c: move.c };
        classicalVisited.add(keyOf(move.r, move.c));
        if (move.r === EXIT.r && move.c === EXIT.c) classicalReachedAt = stepCount;
      }

      quantumState = quantumWalkStep(quantumState, model);
      const probabilities = positionProbabilities(quantumState, model);
      const pExit = probabilities[model.exitIndex];

      if (statusElement) {
        const classicalMessage = classicalReachedAt === stepCount
          ? `The classical walker just reached Exit at step ${stepCount}. `
          : "";
        statusElement.textContent = `${classicalMessage}After step ${stepCount}, the quantum walker assigns ${(pExit * 100).toFixed(2)}% probability to Exit.`;
      }

      renderAll();
    }

    function measureQuantum() {
      const sampledBasis = sampleQuantumBasis(quantumState);
      const measuredPositionIndex = Math.floor(sampledBasis / 4);
      const measuredDirection = sampledBasis % 4;
      const measuredPosition = model.positions[measuredPositionIndex];

      // Full position+coin projective measurement. The next walk step evolves from
      // this collapsed basis state, so the user can continue after measuring.
      const collapsed = new Float64Array(model.dimension);
      collapsed[sampledBasis] = 1;
      quantumState = collapsed;

      const atExit = measuredPosition.r === EXIT.r && measuredPosition.c === EXIT.c;
      if (statusElement) {
        statusElement.textContent = atExit
          ? `Quantum measurement found Exit at (${measuredPosition.r + 1}, ${measuredPosition.c + 1}) with coin |${DIRS[measuredDirection].label}⟩. The state has collapsed.`
          : `Measured the quantum walker at (${measuredPosition.r + 1}, ${measuredPosition.c + 1}) with coin |${DIRS[measuredDirection].label}⟩. The state collapsed there; you can keep stepping.`;
      }

      renderAll();
    }

    generateButton.addEventListener("click", newMaze);
    resetButton.addEventListener("click", resetWalkers);
    stepButton.addEventListener("click", stepBoth);
    measureButton.addEventListener("click", measureQuantum);

    newMaze();
  }

  function mountMazeRunner() {
    const grid = document.querySelector(".quantum-games__grid");
    const template = document.getElementById("quantum-maze-runner-template");
    if (!grid || !template) return;

    if (!grid.querySelector("[data-quantum-maze-runner]")) {
      grid.appendChild(template.content.cloneNode(true));
    }

    grid.querySelectorAll("[data-quantum-maze-runner]").forEach(initMazeRunner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountMazeRunner, { once: true });
  } else {
    mountMazeRunner();
  }
})();
