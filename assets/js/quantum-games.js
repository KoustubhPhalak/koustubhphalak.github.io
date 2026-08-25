(() => {
  "use strict";

  const SIZE = 4;
  const BOX = 2;
  const EMPTY = -1;
  const DEFAULT_EMPTY = 8;
  const MAX_QUBITS = 14;
  const QAOA_SHOTS = 2048;

  const cloneGrid = (grid) => grid.map((row) => [...row]);

  function shuffled(values) {
    const a = [...values];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isPlacementValid(grid, row, col, value, emptyValue = 0) {
    for (let c = 0; c < SIZE; c += 1) {
      if (c !== col && grid[row][c] === value) return false;
    }
    for (let r = 0; r < SIZE; r += 1) {
      if (r !== row && grid[r][col] === value) return false;
    }

    const boxRow = Math.floor(row / BOX) * BOX;
    const boxCol = Math.floor(col / BOX) * BOX;
    for (let r = boxRow; r < boxRow + BOX; r += 1) {
      for (let c = boxCol; c < boxCol + BOX; c += 1) {
        if ((r !== row || c !== col) && grid[r][c] === value) return false;
      }
    }

    return grid[row][col] === emptyValue || grid[row][col] === value;
  }

  function generateFullGrid() {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    function fill(position = 0) {
      if (position === SIZE * SIZE) return true;
      const row = Math.floor(position / SIZE);
      const col = position % SIZE;

      for (const value of shuffled([1, 2, 3, 4])) {
        if (!isPlacementValid(grid, row, col, value, 0)) continue;
        grid[row][col] = value;
        if (fill(position + 1)) return true;
        grid[row][col] = 0;
      }
      return false;
    }

    fill();
    return grid;
  }

  function puzzleCandidates(grid, row, col) {
    if (grid[row][col] !== EMPTY) return [];
    const values = [];
    for (let value = 1; value <= SIZE; value += 1) {
      if (isPlacementValid(grid, row, col, value, EMPTY)) values.push(value);
    }
    return values;
  }

  function countSolutions(puzzle, limit = 2) {
    const grid = cloneGrid(puzzle);
    let count = 0;

    function search() {
      if (count >= limit) return;

      let bestRow = -1;
      let bestCol = -1;
      let bestCandidates = null;

      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          if (grid[row][col] !== EMPTY) continue;
          const candidates = puzzleCandidates(grid, row, col);
          if (candidates.length === 0) return;
          if (bestCandidates === null || candidates.length < bestCandidates.length) {
            bestRow = row;
            bestCol = col;
            bestCandidates = candidates;
          }
        }
      }

      if (bestCandidates === null) {
        count += 1;
        return;
      }

      for (const value of bestCandidates) {
        grid[bestRow][bestCol] = value;
        search();
        grid[bestRow][bestCol] = EMPTY;
        if (count >= limit) return;
      }
    }

    search();
    return count;
  }

  function candidatesFor(puzzle, row, col) {
    return puzzleCandidates(puzzle, row, col);
  }

  // Explicit upper-triangular QUBO convention:
  // E(x) = offset + sum_i Q[i][i] x_i + sum_{i<j} Q[i][j] x_i x_j.
  // Each exactly-one constraint contributes (sum x - 1)^2.
  function buildReducedQubo(puzzle) {
    const variables = [];
    const variableIndex = new Map();

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (puzzle[row][col] !== EMPTY) continue;
        for (const value of candidatesFor(puzzle, row, col)) {
          const index = variables.length;
          variables.push({ row, col, value });
          variableIndex.set(`${row},${col},${value}`, index);
        }
      }
    }

    const n = variables.length;
    const Q = Array.from({ length: n }, () => Array(n).fill(0));
    const groups = [];
    let offset = 0;
    let infeasible = false;

    const addExactlyOne = (indices, label) => {
      if (indices.length === 0) {
        infeasible = true;
        return;
      }

      groups.push({ indices: [...indices], label });
      offset += 1;

      // (sum x - 1)^2 = 1 - sum_i x_i + 2 sum_{i<j} x_i x_j.
      for (const i of indices) Q[i][i] -= 1;
      for (let a = 0; a < indices.length; a += 1) {
        for (let b = a + 1; b < indices.length; b += 1) {
          Q[indices[a]][indices[b]] += 2;
        }
      }
    };

    // Exactly one candidate in every empty cell.
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (puzzle[row][col] !== EMPTY) continue;
        const indices = variables
          .map((v, i) => (v.row === row && v.col === col ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices, `cell:${row},${col}`);
      }
    }

    // For each missing value, exactly one occurrence in each row.
    for (let row = 0; row < SIZE; row += 1) {
      for (let value = 1; value <= SIZE; value += 1) {
        if (puzzle[row].includes(value)) continue;
        const indices = variables
          .map((v, i) => (v.row === row && v.value === value ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices, `row:${row}:value:${value}`);
      }
    }

    // For each missing value, exactly one occurrence in each column.
    for (let col = 0; col < SIZE; col += 1) {
      for (let value = 1; value <= SIZE; value += 1) {
        if (puzzle.some((row) => row[col] === value)) continue;
        const indices = variables
          .map((v, i) => (v.col === col && v.value === value ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices, `col:${col}:value:${value}`);
      }
    }

    // For each missing value, exactly one occurrence in each 2x2 box.
    for (let boxRow = 0; boxRow < SIZE; boxRow += BOX) {
      for (let boxCol = 0; boxCol < SIZE; boxCol += BOX) {
        for (let value = 1; value <= SIZE; value += 1) {
          let alreadyPresent = false;
          for (let r = boxRow; r < boxRow + BOX; r += 1) {
            for (let c = boxCol; c < boxCol + BOX; c += 1) {
              if (puzzle[r][c] === value) alreadyPresent = true;
            }
          }
          if (alreadyPresent) continue;

          const indices = variables
            .map((v, i) => (
              v.value === value &&
              v.row >= boxRow && v.row < boxRow + BOX &&
              v.col >= boxCol && v.col < boxCol + BOX
            ) ? i : -1)
            .filter((i) => i >= 0);
          addExactlyOne(indices, `box:${boxRow},${boxCol}:value:${value}`);
        }
      }
    }

    // Convert the explicit QUBO into H_C = constant + sum h_i Z_i + sum J_ij Z_i Z_j
    // using x_i = (1 - Z_i) / 2.
    const h = Array(n).fill(0);
    const J = [];
    let isingConstant = offset;

    for (let i = 0; i < n; i += 1) {
      const qii = Q[i][i];
      isingConstant += qii / 2;
      h[i] -= qii / 2;
    }

    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const qij = Q[i][j];
        if (qij === 0) continue;
        isingConstant += qij / 4;
        h[i] -= qij / 4;
        h[j] -= qij / 4;
        J.push({ i, j, coefficient: qij / 4 });
      }
    }

    return {
      variables,
      variableIndex,
      groups,
      Q,
      offset,
      infeasible,
      ising: { constant: isingConstant, h, J },
    };
  }

  function generatePuzzle(numEmpty = DEFAULT_EMPTY) {
    // Keep the browser-QAOA instances small and unambiguous: exactly one Sudoku
    // completion, eight blanks, and <= MAX_QUBITS active reduced-QUBO variables.
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const fullGrid = generateFullGrid();
      const puzzle = cloneGrid(fullGrid);
      const positions = shuffled(
        Array.from({ length: SIZE * SIZE }, (_, index) => index)
      ).slice(0, numEmpty);

      for (const position of positions) {
        const row = Math.floor(position / SIZE);
        const col = position % SIZE;
        puzzle[row][col] = EMPTY;
      }

      const model = buildReducedQubo(puzzle);
      if (!model.infeasible && model.variables.length <= MAX_QUBITS && countSolutions(puzzle, 2) === 1) {
        // Deliberately return only the clues. The completed grid used to construct a
        // guaranteed-solvable puzzle is not retained or used by Solve.
        return puzzle;
      }
    }

    throw new Error("Could not generate a compact unique puzzle. Please try Generate again.");
  }

  function decodeState(puzzle, variables, state) {
    const board = cloneGrid(puzzle);
    for (let index = 0; index < variables.length; index += 1) {
      if ((state & (2 ** index)) !== 0) {
        const variable = variables[index];
        board[variable.row][variable.col] = variable.value;
      }
    }
    return board;
  }

  function isCompleteValidSudoku(board) {
    const target = "1,2,3,4";
    const sortedKey = (values) => [...values].sort((a, b) => a - b).join(",");

    for (let i = 0; i < SIZE; i += 1) {
      if (sortedKey(board[i]) !== target) return false;
      if (sortedKey(board.map((row) => row[i])) !== target) return false;
    }

    for (let br = 0; br < SIZE; br += BOX) {
      for (let bc = 0; bc < SIZE; bc += BOX) {
        const values = [];
        for (let r = br; r < br + BOX; r += 1) {
          for (let c = bc; c < bc + BOX; c += 1) values.push(board[r][c]);
        }
        if (sortedKey(values) !== target) return false;
      }
    }
    return true;
  }

  function initQuantumSudoku(root) {
    const boardElement = root.querySelector(".quantum-sudoku__board");
    const generateButton = root.querySelector("[data-generate]");
    const solveButton = root.querySelector("[data-solve]");
    const statusElement = root.querySelector("[data-status]");
    const qvarElement = root.querySelector("[data-qvar-count]");
    const exactEnergyElement = root.querySelector("[data-exact-energy]");
    const qaoaEnergyElement = root.querySelector("[data-qaoa-energy]");
    const groundProbabilityElement = root.querySelector("[data-ground-probability]");
    const degeneracyElement = root.querySelector("[data-degeneracy]");
    const angleElement = root.querySelector("[data-angles]");
    const sampleListElement = root.querySelector("[data-samples]");

    let puzzle;
    let model;
    let shownBoard;
    let worker = null;
    let generationId = 0;

    function render(board, solved = false) {
      boardElement.replaceChildren();
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          const cell = document.createElement("div");
          cell.className = "quantum-sudoku__cell";
          cell.setAttribute("role", "gridcell");

          const value = board[row][col];
          const isClue = puzzle[row][col] !== EMPTY;
          if (isClue) cell.classList.add("quantum-sudoku__cell--clue");
          if (solved && !isClue && value !== EMPTY) {
            cell.classList.add("quantum-sudoku__cell--solved");
          }

          cell.textContent = value === EMPTY ? "" : String(value);
          cell.setAttribute(
            "aria-label",
            value === EMPTY
              ? `Row ${row + 1}, column ${col + 1}, empty`
              : `Row ${row + 1}, column ${col + 1}, ${value}`
          );
          boardElement.appendChild(cell);
        }
      }
    }

    function clearQuantumMetrics() {
      exactEnergyElement.textContent = "—";
      qaoaEnergyElement.textContent = "—";
      groundProbabilityElement.textContent = "—";
      degeneracyElement.textContent = "—";
      angleElement.textContent = "—";
      sampleListElement.replaceChildren();
      const li = document.createElement("li");
      li.textContent = "Run QAOA to see measured states.";
      sampleListElement.appendChild(li);
    }

    function stopWorker() {
      if (worker) {
        worker.terminate();
        worker = null;
      }
    }

    function newPuzzle() {
      stopWorker();
      generationId += 1;
      try {
        puzzle = generatePuzzle(DEFAULT_EMPTY);
        shownBoard = cloneGrid(puzzle);
        model = buildReducedQubo(puzzle);
        qvarElement.textContent = String(model.variables.length);
        clearQuantumMetrics();
        statusElement.textContent = "New unique randomized puzzle generated. Ready for QAOA.";
        render(shownBoard, false);
      } catch (error) {
        statusElement.textContent = error.message;
      }
    }

    function renderSamples(samples) {
      sampleListElement.replaceChildren();
      for (const sample of samples) {
        const li = document.createElement("li");
        const bitstring = sample.bitstring.padStart(model.variables.length, "0");
        li.innerHTML = `<code>${bitstring}</code><span>E=${sample.energy}</span><span>${sample.count} shots</span>`;
        sampleListElement.appendChild(li);
      }
    }

    function solve() {
      if (!model || model.infeasible) {
        statusElement.textContent = "This puzzle does not have a valid reduced QUBO model.";
        return;
      }

      stopWorker();
      const runId = generationId;
      solveButton.disabled = true;
      generateButton.disabled = true;
      solveButton.textContent = "Running QAOA…";
      statusElement.textContent = "Building exact reference energies and optimizing QAOA angles…";
      clearQuantumMetrics();

      const workerUrl = root.dataset.workerUrl;
      worker = new Worker(workerUrl);

      worker.onmessage = (event) => {
        if (runId !== generationId) return;
        const message = event.data;

        if (message.type === "progress") {
          statusElement.textContent = message.message;
          return;
        }

        if (message.type === "result") {
          const result = message.result;
          shownBoard = decodeState(puzzle, model.variables, result.bestSampleState);
          const valid = result.bestSampleEnergy === result.exactGroundEnergy && isCompleteValidSudoku(shownBoard);

          exactEnergyElement.textContent = String(result.exactGroundEnergy);
          qaoaEnergyElement.textContent = String(result.bestSampleEnergy);
          groundProbabilityElement.textContent = `${(result.groundProbability * 100).toFixed(2)}%`;
          degeneracyElement.textContent = String(result.groundStateCount);
          angleElement.textContent = `γ=${result.gamma.toFixed(3)}, β=${result.beta.toFixed(3)}`;
          renderSamples(result.topSamples);
          render(shownBoard, valid);

          statusElement.textContent = valid
            ? `QAOA sampled the exact ground state using ${result.shots} shots.`
            : `QAOA's best measured state had energy ${result.bestSampleEnergy}; try Solve again or Generate a new puzzle.`;

          solveButton.disabled = false;
          generateButton.disabled = false;
          solveButton.textContent = "Solve with QAOA";
          stopWorker();
          return;
        }

        if (message.type === "error") {
          statusElement.textContent = message.message;
          solveButton.disabled = false;
          generateButton.disabled = false;
          solveButton.textContent = "Solve with QAOA";
          stopWorker();
        }
      };

      worker.onerror = (event) => {
        statusElement.textContent = `QAOA worker failed: ${event.message}`;
        solveButton.disabled = false;
        generateButton.disabled = false;
        solveButton.textContent = "Solve with QAOA";
        stopWorker();
      };

      worker.postMessage({
        type: "solve",
        payload: {
          Q: model.Q,
          offset: model.offset,
          shots: QAOA_SHOTS,
          depth: 1,
        },
      });
    }

    generateButton.addEventListener("click", newPuzzle);
    solveButton.addEventListener("click", solve);
    newPuzzle();
  }

  function initialize() {
    document.querySelectorAll("[data-quantum-sudoku]").forEach(initQuantumSudoku);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
