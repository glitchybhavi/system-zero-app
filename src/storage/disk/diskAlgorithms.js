// Disk Scheduling Algorithms Engine for System Zero
// Supports: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK

export const MAX_TRACK = 199;

export function solveDiskScheduling(algorithm, requestQueue, startHead, direction = 'inward') {
  const queue = [...requestQueue].filter((t) => typeof t === 'number' && !isNaN(t) && t >= 0 && t <= MAX_TRACK);
  const head = Math.max(0, Math.min(MAX_TRACK, startHead));

  let sequence = [];

  switch (algorithm) {
    case 'FCFS':
      sequence = solveFCFS(queue, head);
      break;
    case 'SSTF':
      sequence = solveSSTF(queue, head);
      break;
    case 'SCAN':
      sequence = solveSCAN(queue, head, direction);
      break;
    case 'C-SCAN':
      sequence = solveCSCAN(queue, head, direction);
      break;
    case 'LOOK':
      sequence = solveLOOK(queue, head, direction);
      break;
    case 'C-LOOK':
      sequence = solveCLOOK(queue, head, direction);
      break;
    default:
      sequence = solveFCFS(queue, head);
  }

  // Calculate movements and cumulative distances
  let totalDistance = 0;
  const steps = [{ track: head, distance: 0, totalDistance: 0, isInitial: true }];

  for (let i = 0; i < sequence.length; i++) {
    const prevTrack = steps[i].track;
    const currentTrack = sequence[i];
    const distance = Math.abs(currentTrack - prevTrack);
    totalDistance += distance;
    steps.push({
      track: currentTrack,
      distance,
      totalDistance,
      isInitial: false,
      stepIndex: i + 1,
    });
  }

  return {
    algorithm,
    initialHead: head,
    queue,
    sequence,
    steps,
    totalDistance,
    avgDistance: sequence.length > 0 ? (totalDistance / sequence.length).toFixed(1) : 0,
  };
}

// 1. First-Come, First-Served
function solveFCFS(queue, head) {
  return [...queue];
}

// 2. Shortest Seek Time First
function solveSSTF(queue, head) {
  const remaining = [...queue];
  const sequence = [];
  let current = head;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let minDiff = Math.abs(remaining[0] - current);

    for (let i = 1; i < remaining.length; i++) {
      const diff = Math.abs(remaining[i] - current);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }

    current = remaining[bestIndex];
    sequence.push(current);
    remaining.splice(bestIndex, 1);
  }

  return sequence;
}

// 3. SCAN (Elevator Algorithm to boundary)
function solveSCAN(queue, head, direction) {
  const left = queue.filter((t) => t < head).sort((a, b) => b - a);
  const right = queue.filter((t) => t >= head).sort((a, b) => a - b);

  if (direction === 'inward') {
    // Moving towards MAX_TRACK
    const res = [...right];
    if (left.length > 0) {
      if (right.length === 0 || right[right.length - 1] !== MAX_TRACK) {
        res.push(MAX_TRACK);
      }
      res.push(...left);
    }
    return res;
  } else {
    // Moving towards 0
    const res = [...left];
    if (right.length > 0) {
      if (left.length === 0 || left[left.length - 1] !== 0) {
        res.push(0);
      }
      res.push(...right);
    }
    return res;
  }
}

// 4. C-SCAN (Circular SCAN)
function solveCSCAN(queue, head, direction) {
  const left = queue.filter((t) => t < head).sort((a, b) => a - b);
  const right = queue.filter((t) => t >= head).sort((a, b) => a - b);

  if (direction === 'inward') {
    const res = [...right];
    if (left.length > 0) {
      res.push(MAX_TRACK);
      res.push(0);
      res.push(...left);
    }
    return res;
  } else {
    const leftDesc = queue.filter((t) => t <= head).sort((a, b) => b - a);
    const rightDesc = queue.filter((t) => t > head).sort((a, b) => b - a);
    const res = [...leftDesc];
    if (rightDesc.length > 0) {
      res.push(0);
      res.push(MAX_TRACK);
      res.push(...rightDesc);
    }
    return res;
  }
}

// 5. LOOK (Optimized SCAN without traveling to boundaries)
function solveLOOK(queue, head, direction) {
  const left = queue.filter((t) => t < head).sort((a, b) => b - a);
  const right = queue.filter((t) => t >= head).sort((a, b) => a - b);

  if (direction === 'inward') {
    return [...right, ...left];
  } else {
    return [...left, ...right];
  }
}

// 6. C-LOOK (Optimized Circular LOOK)
function solveCLOOK(queue, head, direction) {
  const left = queue.filter((t) => t < head).sort((a, b) => a - b);
  const right = queue.filter((t) => t >= head).sort((a, b) => a - b);

  if (direction === 'inward') {
    return [...right, ...left];
  } else {
    const leftDesc = queue.filter((t) => t <= head).sort((a, b) => b - a);
    const rightDesc = queue.filter((t) => t > head).sort((a, b) => b - a);
    return [...leftDesc, ...rightDesc];
  }
}
