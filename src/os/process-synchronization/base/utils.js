export const INITIAL_BALANCE = 100;
export const INCREMENT_VALUE = 10;

export const THREAD_COLORS = [
  'green',
  'red',
  'orange',
  'blue',
  'cyan',
  'purple',
  'pink',
  'yellow',
  'teal',
  'lime',
  'indigo',
  'violet',
  'magenta',
  'brown',
  'gray'
];

export const HUD_COLORS = {
  ok: '#34d399',
  danger: '#f87171',
  label: '#94a3b8',
  idle: '#64748b',
  info: '#38bdf8',
};

export function generateProcessColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 45%, 70%)`;
}

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
