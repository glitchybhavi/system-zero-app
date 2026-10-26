export default function CodeViewer(props) {
  const pills = [];
  for (let i = 0; i < props.processes.length; i++) {
    const p = props.processes[i];

    let progress = `Line ${p.line}`;
    if (p.status === 'waiting') {
      progress = `Line ${p.line} (Wait)`;
    } else if (p.line > props.maxLine) {
      progress = 'Done';
    }

    pills.push(
      <span
        key={p.id}
        className={`indicator-pill thread-slot-${p.id % 4}`}
        data-thread-id={p.id}
        style={{ color: p.color }}
      >
        P{p.id}: {progress}
      </span>
    );
  }

  const lines = [];
  for (let i = 0; i < props.code.length; i++) {
    const codeLine = props.code[i];

    const onThisLine = [];
    for (let j = 0; j < props.processes.length; j++) {
      if (props.processes[j].line === codeLine.line && props.processes[j].line <= props.maxLine) {
        onThisLine.push(props.processes[j]);
      }
    }

    let lineStyle = {};
    let numStyle = {};
    let activeClass = '';
    if (onThisLine.length > 0) {
      const first = onThisLine[0];
      activeClass = ` active active-thread-${first.id % 4}`;
      lineStyle = {
        background: `linear-gradient(90deg, color-mix(in srgb, ${first.color} 22%, transparent) 0%, color-mix(in srgb, ${first.color} 4%, transparent) 100%)`,
        borderLeft: `3px solid ${first.color}`,
        borderRadius: '6px',
      };
      numStyle = {
        color: first.color,
        fontWeight: 700,
      };
    }

    lines.push(
      <div key={codeLine.line} className={`code-line${activeClass}`} style={lineStyle}>
        <span className="line-num" style={numStyle}>{codeLine.line}</span>
        <span className="line-text">{codeLine.text}</span>
      </div>
    );
  }

  return (
    <div className="code-viewer-panel">
      <header className="code-viewer-header">
        <span className="code-title">{props.title}</span>
        <div className="code-thread-status">{pills}</div>
      </header>

      <div className="code-content">{lines}</div>
    </div>
  );
}
