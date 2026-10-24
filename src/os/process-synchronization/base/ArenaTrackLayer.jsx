export default function ArenaTrackLayer(props) {
  const gateTops = ['32%', '68%'];
  const lockedStates = [props.gate0Locked, props.gate1Locked];

  const rails = [];
  for (let i = 0; i < props.tracks.length; i++) {
    const track = props.tracks[i];
    rails.push(
      <div key={`entry-${i}`} className="rail-conduit rail-conduit-entry" style={{ top: track.top }} />
    );
  }

  const gates = [];
  for (let i = 0; i < gateTops.length; i++) {
    let stateClass = 'unlocked';
    let labelText = 'Unlocked';
    if (lockedStates[i]) {
      stateClass = 'locked';
      labelText = 'Locked';
    }

    gates.push(
      <div key={`bay-track-${i}`}>
        <div
          className={`track-gate-node ${stateClass}`}
          style={{ top: gateTops[i], left: 'calc(50% - 272px)' }}
        >
          <div className={`gate-pin ${stateClass}`} />
          <span className={`gate-label ${stateClass}`}>{labelText}</span>
        </div>

        <div>
          <div className="rail-conduit rail-conduit-exit" style={{ top: gateTops[i] }} />
          <span className="track-terminated-label" style={{ top: gateTops[i] }}>
            Terminated
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-track-layer">
      {rails}
      {gates}
    </div>
  );
}
