(() => {
  "use strict";

  const REGION_COUNT = 6;
  const COLOR_COUNT = 3;
  const LABELS = ["A", "B", "C", "D", "E", "F"];
  const VIEW_W = 100;
  const VIEW_H = 70;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const EXACT_ONE_WEIGHT = 2;
  const BORDER_WEIGHT = 1;
  const SHOTS = 2048;

  function secureRandomUnit() {
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] / 4294967296;
    }
    return Math.random();
  }

  function randomBetween(min, max) {
    return min + (max - min) * secureRandomUnit();
  }

  function clipPolygonHalfPlane(polygon, a, b, c) {
    if (polygon.length === 0) return [];
    const result = [];
    const inside = (p) => a * p.x + b * p.y <= c + 1e-8;
    const intersect = (p, q) => {
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const denom = a * dx + b * dy;
      if (Math.abs(denom) < 1e-12) return { x: p.x, y: p.y };
      const t = (c - a * p.x - b * p.y) / denom;
      return { x: p.x + t * dx, y: p.y + t * dy };
    };

    for (let i = 0; i < polygon.length; i += 1) {
      const current = polygon[i];
      const previous = polygon[(i + polygon.length - 1) % polygon.length];
      const currentInside = inside(current);
      const previousInside = inside(previous);

      if (currentInside) {
        if (!previousInside) result.push(intersect(previous, current));
        result.push(current);
      } else if (previousInside) {
        result.push(intersect(previous, current));
      }
    }
    return result;
  }

  function voronoiCell(seedIndex, seeds) {
    let polygon = [
      { x: 0, y: 0 },
      { x: VIEW_W, y: 0 },
      { x: VIEW_W, y: VIEW_H },
      { x: 0, y: VIEW_H },
    ];
    const s = seeds[seedIndex];

    for (let j = 0; j < seeds.length; j += 1) {
      if (j === seedIndex) continue;
      const t = seeds[j];
      const a = 2 * (t.x - s.x);
      const b = 2 * (t.y - s.y);
      const c = t.x * t.x + t.y * t.y - s.x * s.x - s.y * s.y;
      polygon = clipPolygonHalfPlane(polygon, a, b, c);
      if (polygon.length === 0) break;
    }
    return polygon;
  }

  function polygonArea(poly) {
    let area = 0;
    for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      area += a.x * b.y - b.x * a.y;
    }
    return Math.abs(area) / 2;
  }

  function polygonCentroid(poly) {
    let signedArea = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < poly.length; i += 1) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const cross = p.x * q.y - q.x * p.y;
      signedArea += cross;
      cx += (p.x + q.x) * cross;
      cy += (p.y + q.y) * cross;
    }
    signedArea *= 0.5;
    if (Math.abs(signedArea) < 1e-9) {
      return poly.reduce((acc, p) => ({ x: acc.x + p.x / poly.length, y: acc.y + p.y / poly.length }), { x: 0, y: 0 });
    }
    return { x: cx / (6 * signedArea), y: cy / (6 * signedArea) };
  }

  function sharedSegment(polyA, polyB) {
    const tol = 1e-5;
    for (let i = 0; i < polyA.length; i += 1) {
      const p = polyA[i];
      const q = polyA[(i + 1) % polyA.length];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const len = Math.hypot(dx, dy);
      if (len < tol) continue;
      const ux = dx / len;
      const uy = dy / len;

      for (let j = 0; j < polyB.length; j += 1) {
        const r = polyB[j];
        const s = polyB[(j + 1) % polyB.length];
        const distR = Math.abs(dx * (r.y - p.y) - dy * (r.x - p.x)) / len;
        const distS = Math.abs(dx * (s.y - p.y) - dy * (s.x - p.x)) / len;
        if (distR > 2e-4 || distS > 2e-4) continue;

        const tr = (r.x - p.x) * ux + (r.y - p.y) * uy;
        const ts = (s.x - p.x) * ux + (s.y - p.y) * uy;
        const lo = Math.max(0, Math.min(tr, ts));
        const hi = Math.min(len, Math.max(tr, ts));
        if (hi - lo > 0.45) {
          return {
            a: { x: p.x + ux * lo, y: p.y + uy * lo },
            b: { x: p.x + ux * hi, y: p.y + uy * hi },
          };
        }
      }
    }
    return null;
  }

  function graphConnected(adjacency) {
    const seen = new Set([0]);
    const stack = [0];
    while (stack.length) {
      const node = stack.pop();
      for (const next of adjacency[node]) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
    return seen.size === adjacency.length;
  }

  function canColor(adjacency, numColors) {
    const colors = Array(adjacency.length).fill(-1);
    const order = Array.from({ length: adjacency.length }, (_, i) => i)
      .sort((a, b) => adjacency[b].length - adjacency[a].length);

    function search(position) {
      if (position === order.length) return true;
      const node = order[position];
      for (let color = 0; color < numColors; color += 1) {
        let valid = true;
        for (const neighbor of adjacency[node]) {
          if (colors[neighbor] === color) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;
        colors[node] = color;
        if (search(position + 1)) return true;
        colors[node] = -1;
      }
      return false;
    }
    return search(0);
  }

  function generateMapModel() {
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const seeds = [];
      let seedTries = 0;
      while (seeds.length < REGION_COUNT && seedTries < 500) {
        seedTries += 1;
        const candidate = { x: randomBetween(8, 92), y: randomBetween(7, 63) };
        if (seeds.every((s) => Math.hypot(s.x - candidate.x, s.y - candidate.y) > 15)) {
          seeds.push(candidate);
        }
      }
      if (seeds.length !== REGION_COUNT) continue;

      const polygons = seeds.map((_, i) => voronoiCell(i, seeds));
      if (polygons.some((poly) => poly.length < 3 || polygonArea(poly) < 500)) continue;

      const adjacency = Array.from({ length: REGION_COUNT }, () => []);
      const edges = [];
      for (let i = 0; i < REGION_COUNT; i += 1) {
        for (let j = i + 1; j < REGION_COUNT; j += 1) {
          const segment = sharedSegment(polygons[i], polygons[j]);
          if (!segment) continue;
          adjacency[i].push(j);
          adjacency[j].push(i);
          edges.push({ i, j, segment });
        }
      }

      if (edges.length < 7 || edges.length > 11) continue;
      if (!graphConnected(adjacency)) continue;
      if (!canColor(adjacency, 3)) continue;
      if (canColor(adjacency, 2)) continue; // Require a genuinely three-color problem.

      // Choose an adjacent pair with high combined degree for symmetry breaking.
      const anchorEdge = [...edges].sort(
        (a, b) => (adjacency[b.i].length + adjacency[b.j].length) - (adjacency[a.i].length + adjacency[a.j].length)
      )[0];

      return {
        seeds,
        polygons,
        centroids: polygons.map(polygonCentroid),
        adjacency,
        edges,
        anchorA: anchorEdge.i,
        anchorB: anchorEdge.j,
      };
    }
    throw new Error("Could not generate a suitable 3-colorable map. Try again.");
  }

  function buildFullQubo(model) {
    const n = REGION_COUNT * COLOR_COUNT;
    const Q = Array.from({ length: n }, () => Array(n).fill(0));
    let offset = 0;
    const idx = (region, color) => region * COLOR_COUNT + color;

    const addExactlyOne = (indices, weight) => {
      offset += weight;
      for (const i of indices) Q[i][i] -= weight;
      for (let a = 0; a < indices.length; a += 1) {
        for (let b = a + 1; b < indices.length; b += 1) {
          Q[indices[a]][indices[b]] += 2 * weight;
        }
      }
    };

    for (let region = 0; region < REGION_COUNT; region += 1) {
      addExactlyOne([0, 1, 2].map((color) => idx(region, color)), EXACT_ONE_WEIGHT);
    }

    for (const edge of model.edges) {
      for (let color = 0; color < COLOR_COUNT; color += 1) {
        const a = idx(edge.i, color);
        const b = idx(edge.j, color);
        Q[Math.min(a, b)][Math.max(a, b)] += BORDER_WEIGHT;
      }
    }

    return { Q, offset };
  }

  function reduceBySymmetry(model, full) {
    // Any proper coloring can be globally relabeled so two adjacent vertices use
    // colors 0 and 1. Fixing those six one-hot bits removes only equivalent color permutations.
    const fixed = new Map();
    for (let color = 0; color < COLOR_COUNT; color += 1) {
      fixed.set(model.anchorA * COLOR_COUNT + color, color === 0 ? 1 : 0);
      fixed.set(model.anchorB * COLOR_COUNT + color, color === 1 ? 1 : 0);
    }

    const activeFullIndices = [];
    for (let i = 0; i < REGION_COUNT * COLOR_COUNT; i += 1) {
      if (!fixed.has(i)) activeFullIndices.push(i);
    }
    const activeLookup = new Map(activeFullIndices.map((fullIndex, reducedIndex) => [fullIndex, reducedIndex]));
    const Q = Array.from({ length: activeFullIndices.length }, () => Array(activeFullIndices.length).fill(0));
    let offset = full.offset;

    const nFull = full.Q.length;
    for (let i = 0; i < nFull; i += 1) {
      for (let j = i; j < nFull; j += 1) {
        const coefficient = full.Q[i][j];
        if (Math.abs(coefficient) < 1e-12) continue;

        const iFixed = fixed.has(i);
        const jFixed = fixed.has(j);
        if (i === j) {
          if (iFixed) offset += coefficient * fixed.get(i);
          else {
            const ri = activeLookup.get(i);
            Q[ri][ri] += coefficient;
          }
        } else if (iFixed && jFixed) {
          offset += coefficient * fixed.get(i) * fixed.get(j);
        } else if (iFixed || jFixed) {
          const fixedIndex = iFixed ? i : j;
          const activeIndex = iFixed ? j : i;
          if (fixed.get(fixedIndex) === 1) {
            const r = activeLookup.get(activeIndex);
            Q[r][r] += coefficient;
          }
        } else {
          const ri = activeLookup.get(i);
          const rj = activeLookup.get(j);
          Q[Math.min(ri, rj)][Math.max(ri, rj)] += coefficient;
        }
      }
    }

    const variables = activeFullIndices.map((fullIndex) => ({
      fullIndex,
      region: Math.floor(fullIndex / COLOR_COUNT),
      color: fullIndex % COLOR_COUNT,
    }));

    return { Q, offset, variables, fixed };
  }

  function decodeState(state, model, reduced) {
    const selected = Array.from({ length: REGION_COUNT }, () => []);
    selected[model.anchorA].push(0);
    selected[model.anchorB].push(1);

    reduced.variables.forEach((variable, bit) => {
      if ((state & (2 ** bit)) !== 0) selected[variable.region].push(variable.color);
    });

    const colors = selected.map((choices) => choices.length === 1 ? choices[0] : null);
    const invalidRegions = new Set(
      selected.map((choices, region) => choices.length === 1 ? -1 : region).filter((region) => region >= 0)
    );
    return { colors, invalidRegions };
  }

  function conflictsFor(colors, edges) {
    return edges.filter(({ i, j }) => colors[i] !== null && colors[i] === colors[j]);
  }

  function pathForPolygon(poly) {
    return poly.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(" ") + " Z";
  }

  function initMapColorer(root) {
    if (root.dataset.mapColorerReady === "true") return;
    root.dataset.mapColorerReady = "true";

    const svg = root.querySelector("[data-map-svg]");
    const generateButton = root.querySelector("[data-map-generate]");
    const clearButton = root.querySelector("[data-map-clear]");
    const solveButton = root.querySelector("[data-map-solve]");
    const coloredElement = root.querySelector("[data-map-colored]");
    const conflictElement = root.querySelector("[data-map-conflicts]");
    const edgeElement = root.querySelector("[data-map-edges]");
    const qubitElement = root.querySelector("[data-map-qubits]");
    const groundElement = root.querySelector("[data-map-ground]");
    const qaoaEnergyElement = root.querySelector("[data-map-qaoa-energy]");
    const groundProbElement = root.querySelector("[data-map-ground-prob]");
    const anglesElement = root.querySelector("[data-map-angles]");
    const statusElement = root.querySelector("[data-map-status]");
    const samplesBox = root.querySelector("[data-map-samples]");
    const sampleList = root.querySelector("[data-map-sample-list]");

    if (!svg || !generateButton || !clearButton || !solveButton) return;

    let model = null;
    let reduced = null;
    let colors = Array(REGION_COUNT).fill(null);
    let regionPaths = [];
    let regionLabels = [];
    let edgeLines = [];
    let worker = null;

    function setBusy(busy) {
      generateButton.disabled = busy;
      clearButton.disabled = busy;
      solveButton.disabled = busy;
      solveButton.textContent = busy ? "Running QAOA…" : "Solve with QAOA";
    }

    function clearQuantumMetrics() {
      if (groundElement) groundElement.textContent = "—";
      if (qaoaEnergyElement) qaoaEnergyElement.textContent = "—";
      if (groundProbElement) groundProbElement.textContent = "—";
      if (anglesElement) anglesElement.textContent = "—";
      if (samplesBox) samplesBox.hidden = true;
      if (sampleList) sampleList.replaceChildren();
    }

    function updateManualMetrics() {
      const coloredCount = colors.filter((color) => color !== null).length;
      const conflicts = conflictsFor(colors, model.edges);
      if (coloredElement) coloredElement.textContent = `${coloredCount} / ${REGION_COUNT}`;
      if (conflictElement) conflictElement.textContent = String(conflicts.length);

      const conflictKeys = new Set(conflicts.map(({ i, j }) => `${Math.min(i, j)}-${Math.max(i, j)}`));
      edgeLines.forEach(({ element, i, j }) => {
        element.classList.toggle("quantum-map__edge--conflict", conflictKeys.has(`${Math.min(i, j)}-${Math.max(i, j)}`));
      });

      if (coloredCount === REGION_COUNT && conflicts.length === 0 && statusElement) {
        statusElement.textContent = "You found a valid 3-coloring manually — zero conflicting borders.";
      } else if (coloredCount === REGION_COUNT && statusElement) {
        statusElement.textContent = `${conflicts.length} conflicting border${conflicts.length === 1 ? "" : "s"}. Keep adjusting the map or run QAOA.`;
      }
    }

    function renderColors(invalidRegions = new Set()) {
      regionPaths.forEach((path, region) => {
        path.classList.remove(
          "quantum-map__region--color-0",
          "quantum-map__region--color-1",
          "quantum-map__region--color-2",
          "quantum-map__region--invalid"
        );
        const color = colors[region];
        if (color !== null) path.classList.add(`quantum-map__region--color-${color}`);
        if (invalidRegions.has(region)) path.classList.add("quantum-map__region--invalid");

        path.setAttribute(
          "aria-label",
          `Region ${LABELS[region]}, ${color === null ? "uncolored" : `color ${color + 1}`}`
        );
        if (regionLabels[region]) {
          regionLabels[region].classList.toggle("quantum-map__label--uncolored", color === null);
        }
      });
      updateManualMetrics();
    }

    function buildSvg() {
      svg.replaceChildren();
      regionPaths = [];
      regionLabels = [];
      edgeLines = [];

      // Region shapes first.
      model.polygons.forEach((polygon, region) => {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", pathForPolygon(polygon));
        path.setAttribute("class", "quantum-map__region");
        path.setAttribute("tabindex", "0");
        path.setAttribute("role", "button");
        path.setAttribute("aria-label", `Region ${LABELS[region]}, uncolored`);
        const cycle = () => {
          colors[region] = colors[region] === null ? 0 : (colors[region] + 1) % (COLOR_COUNT + 1);
          if (colors[region] === COLOR_COUNT) colors[region] = null;
          clearQuantumMetrics();
          if (statusElement) statusElement.textContent = "Manual coloring changed. Red borders indicate conflicts.";
          renderColors();
        };
        path.addEventListener("click", cycle);
        path.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            cycle();
          }
        });
        svg.appendChild(path);
        regionPaths.push(path);
      });

      // Shared borders above fills so conflicts can be highlighted precisely.
      model.edges.forEach((edge) => {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", edge.segment.a.x.toFixed(3));
        line.setAttribute("y1", edge.segment.a.y.toFixed(3));
        line.setAttribute("x2", edge.segment.b.x.toFixed(3));
        line.setAttribute("y2", edge.segment.b.y.toFixed(3));
        line.setAttribute("class", "quantum-map__edge");
        svg.appendChild(line);
        edgeLines.push({ element: line, i: edge.i, j: edge.j });
      });

      // Labels last.
      model.centroids.forEach((centroid, region) => {
        const label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("x", centroid.x.toFixed(3));
        label.setAttribute("y", centroid.y.toFixed(3));
        label.setAttribute("class", "quantum-map__label quantum-map__label--uncolored");
        label.textContent = LABELS[region];
        svg.appendChild(label);
        regionLabels.push(label);
      });
    }

    function newMap() {
      if (worker) {
        worker.terminate();
        worker = null;
      }
      model = generateMapModel();
      const full = buildFullQubo(model);
      reduced = reduceBySymmetry(model, full);
      colors = Array(REGION_COUNT).fill(null);
      buildSvg();
      renderColors();
      clearQuantumMetrics();
      if (edgeElement) edgeElement.textContent = String(model.edges.length);
      if (qubitElement) qubitElement.textContent = String(reduced.Q.length);
      if (statusElement) {
        statusElement.textContent = `New connected map generated. It needs three colors; regions ${LABELS[model.anchorA]} and ${LABELS[model.anchorB]} are symmetry anchors inside the quantum model.`;
      }
    }

    function clearColors() {
      colors = Array(REGION_COUNT).fill(null);
      clearQuantumMetrics();
      renderColors();
      if (statusElement) statusElement.textContent = "Colors cleared. Click regions to try the puzzle yourself.";
    }

    function renderTopSamples(samples) {
      if (!samplesBox || !sampleList) return;
      sampleList.replaceChildren();
      for (const sample of samples.slice(0, 4)) {
        const decoded = decodeState(sample.state, model, reduced);
        const row = document.createElement("div");
        row.className = "quantum-map__sample-row";

        const dots = document.createElement("span");
        dots.className = "quantum-map__sample-colors";
        decoded.colors.forEach((color) => {
          const dot = document.createElement("span");
          dot.className = color === null
            ? "quantum-map__sample-dot quantum-map__sample-dot--invalid"
            : `quantum-map__sample-dot quantum-map__swatch--${color}`;
          dots.appendChild(dot);
        });

        const probability = document.createElement("span");
        probability.textContent = `${(100 * sample.count / SHOTS).toFixed(1)}%`;
        const energy = document.createElement("span");
        energy.textContent = `E=${sample.energy.toFixed(0)}`;
        row.append(dots, probability, energy);
        sampleList.appendChild(row);
      }
      samplesBox.hidden = false;
    }

    function solveWithQaoa() {
      if (!model || !reduced) return;
      if (worker) worker.terminate();

      const workerUrl = root.dataset.workerUrl || new URL("quantum-map-colorer-worker.js", document.currentScript?.src || window.location.href).href;
      worker = new Worker(workerUrl);
      setBusy(true);
      clearQuantumMetrics();
      if (statusElement) statusElement.textContent = "Building the symmetry-reduced graph-coloring QUBO…";

      worker.onmessage = (event) => {
        const message = event.data || {};
        if (message.type === "progress") {
          if (statusElement) statusElement.textContent = message.message;
          return;
        }
        if (message.type === "error") {
          if (statusElement) statusElement.textContent = `QAOA error: ${message.message}`;
          setBusy(false);
          worker.terminate();
          worker = null;
          return;
        }
        if (message.type !== "result") return;

        const result = message.result;
        const decoded = decodeState(result.bestSampleState, model, reduced);
        colors = decoded.colors;
        renderColors(decoded.invalidRegions);

        if (groundElement) groundElement.textContent = `${result.exactGroundEnergy.toFixed(0)} (${result.groundStateCount} states)`;
        if (qaoaEnergyElement) qaoaEnergyElement.textContent = result.bestSampleEnergy.toFixed(0);
        if (groundProbElement) groundProbElement.textContent = `${(result.groundProbability * 100).toFixed(2)}%`;
        if (anglesElement) anglesElement.textContent = `γ [${result.gammas.map((v) => v.toFixed(2)).join(", ")}], β [${result.betas.map((v) => v.toFixed(2)).join(", ")}]`;
        renderTopSamples(result.topSamples);

        const conflicts = conflictsFor(colors, model.edges).length;
        const valid = decoded.invalidRegions.size === 0 && conflicts === 0 && Math.abs(result.bestSampleEnergy) < 1e-9;
        if (statusElement) {
          statusElement.textContent = valid
            ? `QAOA sampled a zero-energy 3-coloring in ${result.shots} measurements. The displayed map is that measured ground state.`
            : `QAOA's best sampled state had energy ${result.bestSampleEnergy.toFixed(0)}. This run did not measure a valid ground state.`;
        }

        setBusy(false);
        worker.terminate();
        worker = null;
      };

      worker.onerror = (event) => {
        if (statusElement) statusElement.textContent = `Could not start the QAOA worker: ${event.message || "unknown worker error"}`;
        setBusy(false);
        if (worker) worker.terminate();
        worker = null;
      };

      worker.postMessage({
        type: "solve",
        payload: { Q: reduced.Q, offset: reduced.offset, shots: SHOTS },
      });
    }

    generateButton.addEventListener("click", newMap);
    clearButton.addEventListener("click", clearColors);
    solveButton.addEventListener("click", solveWithQaoa);
    newMap();
  }

  function mountMapColorer() {
    const grid = document.querySelector(".quantum-games__grid");
    const template = document.getElementById("quantum-map-colorer-template");
    if (!grid || !template) return;

    if (!grid.querySelector("[data-quantum-map-colorer]")) {
      grid.appendChild(template.content.cloneNode(true));
    }
    grid.querySelectorAll("[data-quantum-map-colorer]").forEach(initMapColorer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountMapColorer, { once: true });
  } else {
    mountMapColorer();
  }
})();
