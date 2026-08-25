(() => {
  "use strict";

  const SIZE = 4;
  const BOX = 2;
  const EMPTY = -1;
  const DEFAULT_EMPTY = 8;

  const cloneGrid = (grid) => grid.map((row) => [...row]);

  function shuffled(values) {
    const a = [...values];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isPlacementValid(grid, row, col, value) {
    if (grid[row].includes(value)) return false;
    if (grid.some((r) => r[col] === value)) return false;

    const boxRow = Math.floor(row / BOX) * BOX;
    const boxCol = Math.floor(col / BOX) * BOX;
    for (let r = boxRow; r < boxRow + BOX; r += 1) {
      for (let c = boxCol; c < boxCol + BOX; c += 1) {
        if (grid[r][c] === value) return false;
      }
    }
    return true;
  }

  function generateFullGrid() {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    function fill(position = 0) {
      if (position === SIZE * SIZE) return true;
      const row = Math.floor(position / SIZE);
      const col = position % SIZE;

      for (const value of shuffled([1, 2, 3, 4])) {
        if (!isPlacementValid(grid, row, col, value)) continue;
        grid[row][col] = value;
        if (fill(position + 1)) return true;
        grid[row][col] = 0;
      }
      return false;
    }

    fill();
    return grid;
  }

  function generatePuzzle(numEmpty = DEFAULT_EMPTY) {
    const solution = generateFullGrid();
    const puzzle = cloneGrid(solution);
    const positions = shuffled(
      Array.from({ length: SIZE * SIZE }, (_, index) => index)
    ).slice(0, numEmpty);

    for (const position of positions) {
      const row = Math.floor(position / SIZE);
      const col = position % SIZE;
      puzzle[row][col] = EMPTY;
    }

    return { solution, puzzle };
  }

  function candidatesFor(puzzle, row, col) {
    if (puzzle[row][col] !== EMPTY) return [];

    const forbidden = new Set();
    for (let i = 0; i < SIZE; i += 1) {
      if (puzzle[row][i] !== EMPTY) forbidden.add(puzzle[row][i]);
      if (puzzle[i][col] !== EMPTY) forbidden.add(puzzle[i][col]);
    }

    const boxRow = Math.floor(row / BOX) * BOX;
    const boxCol = Math.floor(col / BOX) * BOX;
    for (let r = boxRow; r < boxRow + BOX; r += 1) {
      for (let c = boxCol; c < boxCol + BOX; c += 1) {
        if (puzzle[r][c] !== EMPTY) forbidden.add(puzzle[r][c]);
      }
    }

    return [1, 2, 3, 4].filter((value) => !forbidden.has(value));
  }

  // Build the same reduced one-hot objective as the Python version:
  // every still-undecided cell/value pair becomes a binary variable, and
  // each Sudoku rule contributes an exactly-one penalty (sum(x)-1)^2.
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

    const groups = [];
    const addExactlyOne = (indices) => {
      if (indices.length === 0) return;
      let mask = 0;
      for (const index of indices) mask |= (1 << index);
      groups.push(mask >>> 0);
    };

    // Exactly one candidate in every empty cell.
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (puzzle[row][col] !== EMPTY) continue;
        const indices = variables
          .map((v, i) => (v.row === row && v.col === col ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices);
      }
    }

    // For each missing value, exactly one occurrence in each row.
    for (let row = 0; row < SIZE; row += 1) {
      for (let value = 1; value <= SIZE; value += 1) {
        if (puzzle[row].includes(value)) continue;
        const indices = variables
          .map((v, i) => (v.row === row && v.value === value ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices);
      }
    }

    // For each missing value, exactly one occurrence in each column.
    for (let col = 0; col < SIZE; col += 1) {
      for (let value = 1; value <= SIZE; value += 1) {
        if (puzzle.some((row) => row[col] === value)) continue;
        const indices = variables
          .map((v, i) => (v.col === col && v.value === value ? i : -1))
          .filter((i) => i >= 0);
        addExactlyOne(indices);
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
          addExactlyOne(indices);
        }
      }
    }

    return { variables, groups, variableIndex };
  }

  function popcount32(value) {
    value >>>= 0;
    value -= (value >>> 1) & 0x55555555;
    value = (value & 0x33333333) + ((value >>> 2) & 0x33333333);
    return (((value + (value >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
  }

  function quboEnergy(state, groups) {
    let energy = 0;
    for (const mask of groups) {
      const count = popcount32((state & mask) >>> 0);
      const delta = count - 1;
      energy += delta * delta;
    }
    return energy;
  }

  function solveReducedQubo(puzzle) {
    const model = buildReducedQubo(puzzle);
    const n = model.variables.length;

    if (n === 0) {
      return { board: cloneGrid(puzzle), energy: 0, numVariables: 0, statesChecked: 1 };
    }

    // With eight blanks in a valid random 4x4 puzzle this is normally 8–17
    // variables, keeping exact browser minimization small enough to be interactive.
    if (n > 25) {
      throw new Error(`Reduced model has ${n} variables; generate a smaller puzzle.`);
    }

    const totalStates = 2 ** n;
    let bestEnergy = Number.POSITIVE_INFINITY;
    let bestState = 0;

    for (let state = 0; state < totalStates; state += 1) {
      const energy = quboEnergy(state, model.groups);
      if (energy < bestEnergy) {
        bestEnergy = energy;
        bestState = state;
        if (energy === 0) break;
      }
    }

    const board = cloneGrid(puzzle);
    model.variables.forEach((variable, index) => {
      if (((bestState >>> index) & 1) === 1) {
        board[variable.row][variable.col] = variable.value;
      }
    });

    return {
      board,
      energy: bestEnergy,
      numVariables: n,
      statesChecked: totalStates,
    };
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
    const energyElement = root.querySelector("[data-energy]");

    let puzzle;
    let shownBoard;

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
            value === EMPTY ? `Row ${row + 1}, column ${col + 1}, empty` : `Row ${row + 1}, column ${col + 1}, ${value}`
          );
          boardElement.appendChild(cell);
        }
      }
    }

    function newPuzzle() {
      const generated = generatePuzzle(DEFAULT_EMPTY);
      puzzle = generated.puzzle;
      shownBoard = cloneGrid(puzzle);
      const model = buildReducedQubo(puzzle);
      qvarElement.textContent = String(model.variables.length);
      energyElement.textContent = "—";
      statusElement.textContent = "New randomized puzzle generated.";
      render(shownBoard, false);
    }

    function solve() {
      solveButton.disabled = true;
      generateButton.disabled = true;
      solveButton.textContent = "Solving…";
      statusElement.textContent = "Searching the reduced QUBO energy landscape…";

      // Let the UI paint before doing the small exhaustive search.
      window.setTimeout(() => {
        try {
          const result = solveReducedQubo(puzzle);
          shownBoard = result.board;
          const valid = result.energy === 0 && isCompleteValidSudoku(result.board);

          qvarElement.textContent = String(result.numVariables);
          energyElement.textContent = String(result.energy);
          statusElement.textContent = valid
            ? `Ground state found. Valid Sudoku solution.`
            : `Best state has energy ${result.energy}; no valid ground state was decoded.`;
          render(shownBoard, valid);
        } catch (error) {
          statusElement.textContent = error.message;
        } finally {
          solveButton.disabled = false;
          generateButton.disabled = false;
          solveButton.textContent = "Solve";
        }
      }, 30);
    }

    generateButton.addEventListener("click", newPuzzle);
    solveButton.addEventListener("click", solve);
    newPuzzle();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-quantum-sudoku]").forEach(initQuantumSudoku);
  });
})();
