(() => {
  "use strict";

  const NUM_QUBITS = 4;
  const NUM_STATES = 2 ** NUM_QUBITS;
  const OPTIMAL_ITERATIONS = Math.floor((Math.PI / 4) * Math.sqrt(NUM_STATES));

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

  function basisLabel(index) {
    return index.toString(2).padStart(NUM_QUBITS, "0");
  }

  function createUniformState() {
    const amplitude = 1 / Math.sqrt(NUM_STATES);
    return new Float64Array(NUM_STATES).fill(amplitude);
  }

  // One exact Grover iteration for a single marked item.
  // In this circuit the amplitudes remain real, so a Float64 statevector is sufficient.
  function applyGroverIteration(statevector, markedIndex) {
    // Oracle: O_f |x> = (-1)^f(x) |x>. Only the marked basis state changes phase.
    statevector[markedIndex] *= -1;

    // Diffusion operator: 2|s><s| - I, i.e. inversion about the mean amplitude.
    let mean = 0;
    for (let i = 0; i < NUM_STATES; i += 1) mean += statevector[i];
    mean /= NUM_STATES;

    for (let i = 0; i < NUM_STATES; i += 1) {
      statevector[i] = (2 * mean) - statevector[i];
    }
  }

  function probabilityOf(statevector, index) {
    const amplitude = statevector[index];
    return amplitude * amplitude;
  }

  function sampleState(statevector) {
    const draw = secureRandomUnit();
    let cumulative = 0;
    for (let i = 0; i < NUM_STATES; i += 1) {
      cumulative += probabilityOf(statevector, i);
      if (draw < cumulative || i === NUM_STATES - 1) return i;
    }
    return NUM_STATES - 1;
  }

  function initGroverHunt(root) {
    if (root.dataset.groverReady === "true") return;
    root.dataset.groverReady = "true";

    const board = root.querySelector("[data-grover-board]");
    const generateButton = root.querySelector("[data-grover-generate]");
    const stepButton = root.querySelector("[data-grover-step]");
    const measureButton = root.querySelector("[data-grover-measure]");
    const iterationElement = root.querySelector("[data-grover-iteration]");
    const successElement = root.querySelector("[data-grover-success]");
    const oracleElement = root.querySelector("[data-grover-oracles]");
    const statusElement = root.querySelector("[data-grover-status]");

    if (!board || !generateButton || !stepButton || !measureButton) return;

    let markedIndex = 0;
    let statevector = createUniformState();
    let iterations = 0;
    let measuredIndex = null;
    let measured = false;

    const tiles = [];
    for (let i = 0; i < NUM_STATES; i += 1) {
      const tile = document.createElement("div");
      tile.className = "quantum-grover__tile";
      tile.setAttribute("role", "gridcell");
      tile.innerHTML = `
        <span class="quantum-grover__probability-fill" aria-hidden="true"></span>
        <span class="quantum-grover__mystery">?</span>
        <span class="quantum-grover__basis">|${basisLabel(i)}⟩</span>
        <span class="quantum-grover__probability" data-probability>6.25%</span>
      `;
      board.appendChild(tile);
      tiles.push(tile);
    }

    function render() {
      for (let i = 0; i < NUM_STATES; i += 1) {
        const tile = tiles[i];
        const probability = probabilityOf(statevector, i);
        const percent = probability * 100;
        const fill = tile.querySelector(".quantum-grover__probability-fill");
        const probabilityLabel = tile.querySelector("[data-probability]");
        const mystery = tile.querySelector(".quantum-grover__mystery");

        fill.style.height = `${Math.max(0, Math.min(100, percent))}%`;
        probabilityLabel.textContent = `${percent.toFixed(percent >= 10 ? 1 : 2)}%`;
        tile.classList.toggle("quantum-grover__tile--measured", measuredIndex === i);
        tile.classList.toggle("quantum-grover__tile--treasure", measuredIndex === i && i === markedIndex);
        tile.classList.toggle("quantum-grover__tile--miss", measuredIndex === i && i !== markedIndex);

        if (measuredIndex === i) {
          mystery.textContent = i === markedIndex ? "💎" : "×";
        } else {
          mystery.textContent = "?";
        }

        tile.setAttribute(
          "aria-label",
          `State ${basisLabel(i)}, simulator probability ${percent.toFixed(2)} percent${measuredIndex === i ? (i === markedIndex ? ", treasure measured" : ", measured empty") : ""}`
        );
      }

      const successProbability = probabilityOf(statevector, markedIndex);
      if (iterationElement) iterationElement.textContent = `${iterations} / ${OPTIMAL_ITERATIONS} optimal`;
      if (successElement) successElement.textContent = `${(successProbability * 100).toFixed(2)}%`;
      if (oracleElement) oracleElement.textContent = String(iterations);

      // A Grover iteration is computationally tiny for four qubits, so there is no
      // arbitrary step cap. Once measured, this run has collapsed and the user
      // starts a fresh experiment with Generate.
      stepButton.disabled = measured;
      measureButton.disabled = measured;
      stepButton.textContent = measured ? "Run ended" : "Grover Step";
      measureButton.textContent = measured ? "Measured" : "Measure";
    }

    function generate() {
      markedIndex = randomInt(NUM_STATES);
      statevector = createUniformState();
      iterations = 0;
      measuredIndex = null;
      measured = false;
      if (statusElement) {
        statusElement.textContent = "New hidden treasure generated. All 16 basis states begin with equal probability.";
      }
      render();
    }

    function step() {
      if (measured) return;
      applyGroverIteration(statevector, markedIndex);
      iterations += 1;

      const p = probabilityOf(statevector, markedIndex) * 100;
      if (statusElement) {
        if (iterations === OPTIMAL_ITERATIONS) {
          statusElement.textContent = `Optimal depth reached: the hidden state's measurement probability is now ${p.toFixed(2)}%.`;
        } else if (iterations > OPTIMAL_ITERATIONS) {
          statusElement.textContent = `You over-rotated past the optimum. Grover probability oscillates; it does not increase forever.`;
        } else {
          statusElement.textContent = `Oracle + diffusion applied once. The marked state's amplitude has been amplified.`;
        }
      }
      render();
    }

    function measure() {
      if (measured) return;
      measuredIndex = sampleState(statevector);
      measured = true;

      const success = measuredIndex === markedIndex;
      const measuredLabel = basisLabel(measuredIndex);
      if (statusElement) {
        statusElement.textContent = success
          ? `Measured |${measuredLabel}⟩ — treasure found after ${iterations} oracle call${iterations === 1 ? "" : "s"}!`
          : `Measured |${measuredLabel}⟩ — empty. The wavefunction collapsed; Generate starts a new search.`;
      }
      render();
    }

    generateButton.addEventListener("click", generate);
    stepButton.addEventListener("click", step);
    measureButton.addEventListener("click", measure);
    generate();
  }

  function mountGroverCard() {
    const grid = document.querySelector(".quantum-games__grid");
    const template = document.getElementById("grovers-treasure-hunt-template");
    if (!grid || !template) return;

    if (!grid.querySelector("[data-grover-hunt]")) {
      grid.appendChild(template.content.cloneNode(true));
    }

    grid.querySelectorAll("[data-grover-hunt]").forEach(initGroverHunt);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGroverCard, { once: true });
  } else {
    mountGroverCard();
  }
})();
