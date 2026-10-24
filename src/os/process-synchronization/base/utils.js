export const INITIAL_BALANCE = 100;
export const INCREMENT_VALUE = 10;

export const THREAD_COLORS = [
  '#ee2a2aff',
  '#22d3ee',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
  '#2dd4bf',
  '#e879f9',
  '#60a5fa',
  '#fda4af',
  '#38bdf8',
  '#d8b4fe',
  '#818cf8',
  '#fdba74',
  '#5eead4',
  '#f9a8d4'
];

export const HUD_COLORS = {
  ok: '#34d399',
  danger: '#f87171',
  label: '#94a3b8',
  idle: '#64748b',
  info: '#38bdf8',
};


export function getProcessCardClass(status) {
  if (status === 'spawning') {
    return 'card-pos-spawning';
  }
  if (status === 'waiting' || status === 'busy-waiting') {
    return 'card-pos-waiting';
  }
  if (status === 'ready') {
    return 'card-pos-ready';
  }
  if (status === 'terminated') {
    return 'card-pos-terminated';
  }
  return 'card-pos-bay';
}

export function getProcessStatusText(status) {
  if (status === 'spawning' || status === 'ready') {
    return 'Ready';
  }
  if (status === 'waiting' || status === 'busy-waiting') {
    return 'Waiting';
  }
  if (status === 'terminated') {
    return 'Terminated';
  }
  return 'Executing';
}

export function updateProcessOnTrack(processes, trackIndex, changes) {
  const newList = [];
  for (let i = 0; i < processes.length; i++) {
    if (i === trackIndex) {
      newList.push({ ...processes[i], ...changes });
    } else {
      newList.push(processes[i]);
    }
  }
  return newList;
}

export function replaceAt(list, index, newItem) {
  const newList = [];
  for (let i = 0; i < list.length; i++) {
    if (i === index) {
      newList.push(newItem);
    } else {
      newList.push(list[i]);
    }
  }
  return newList;
}
