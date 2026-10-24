import { getProcessCardClass, getProcessStatusText } from './utils';

export default function ProcessCard(props) {
  let isTerminated = false;
  if (props.isExiting || props.process.status === 'terminated') {
    isTerminated = true;
  }

  let cardClass = 'process-card ' + getProcessCardClass(props.process.status);
  if (isTerminated) {
    cardClass = cardClass + ' card-exiting';
  }

  let statusText = getProcessStatusText(props.process.status);
  if (isTerminated) {
    statusText = 'Terminated';
  }

  let pillClass = 'card-state-pill';
  if (props.process.status === 'waiting' || props.process.status === 'busy-waiting') {
    pillClass = pillClass + ' waiting';
  } else if (props.process.status === 'in-bay') {
    pillClass = pillClass + ' executing';
  } else if (isTerminated) {
    pillClass = pillClass + ' terminated';
  }

  let localText = '--';
  if (props.process.local !== null) {
    localText = `₹${props.process.local}`;
  }

  let tip = '';
  if (!isTerminated) {
    tip = `Process P${props.process.id} (Line ${props.process.line})`;
  }

  return (
    <div className={cardClass} style={{ top: props.top }} title={tip}>
      <div className="card-id-tag" style={{ color: props.process.color }}>
        P{props.process.id}
      </div>

      <div className="card-info-group">
        <span className="card-register-val">Local: {localText}</span>
        <span className={pillClass}>{statusText}</span>
      </div>
    </div>
  );
}
