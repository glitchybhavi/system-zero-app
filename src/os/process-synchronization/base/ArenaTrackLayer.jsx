export default function ArenaTrackLayer(props) {
  const BAY_CENTER_X = 'calc(50% - 170px)';
  const BAY_TOP_EDGE = 'calc(50% - 18px)';
  const BAY_BOTTOM_EDGE = 'calc(50% + 18px)';

  let gateTops = ['32%', '68%'];
  if (props.singleBay) {
    gateTops = [props.tracks[0].top, props.tracks[1].top];
  }
  const lockedStates = [props.gate0Locked, props.gate1Locked];

  const rails = [];
  for (let i = 0; i < props.tracks.length; i++) {
    const track = props.tracks[i];

    if (props.singleBay) {
      rails.push(
        <div
          key={`lane-${i}`}
          className="rail-conduit"
          style={{ top: track.top, left: 0, width: BAY_CENTER_X }}
        />
      );

      let verticalTop = BAY_BOTTOM_EDGE;
      let verticalHeight = `calc(${track.top} - 50% - 18px)`;
      if (i === 0) {
        verticalTop = track.top;
        verticalHeight = `calc(50% - 18px - ${track.top})`;
      }
      rails.push(
        <div
          key={`turn-${i}`}
          className="rail-vertical"
          style={{ top: verticalTop, height: verticalHeight, left: BAY_CENTER_X }}
        />
      );
    } else {
      rails.push(
        <div key={`entry-${i}`} className="rail-conduit rail-conduit-entry" style={{ top: track.top }} />
      );
    }
  }

  const gates = [];
  for (let i = 0; i < gateTops.length; i++) {
    let stateClass = 'unlocked';
    let labelText = 'Unlocked';
    if (lockedStates[i]) {
      stateClass = 'locked';
      labelText = 'Locked';
    }

    let gateText = labelText;
    let labelPlace = '';
    let gateLeft = 'calc(50% - 272px)';
    if (props.singleBay) {
      gateText = `P${i} Gate: ${labelText}`;
      gateLeft = 'calc(50% - 240px)';
      if (i === 1) {
        labelPlace = ' below';
      }
    }

    gates.push(
      <div key={`bay-track-${i}`}>
        <div
          className={`track-gate-node ${stateClass}`}
          style={{ top: gateTops[i], left: gateLeft }}
        >
          <div className={`gate-pin ${stateClass}`} />
          <span className={`gate-label ${stateClass}${labelPlace}`}>{gateText}</span>
        </div>

        {!props.singleBay && (
          <div>
            <div className="rail-conduit rail-conduit-exit" style={{ top: gateTops[i] }} />
            <span className="track-terminated-label" style={{ top: gateTops[i] }}>
              Terminated
            </span>
          </div>
        )}
      </div>
    );
  }

  let exitRail = null;
  if (props.singleBay) {
    exitRail = (
      <div>
        <div className="rail-conduit rail-conduit-exit" style={{ top: '50%' }} />
        <span className="track-terminated-label" style={{ top: '50%' }}>
          Terminated
        </span>
      </div>
    );
  }

  return (
    <div className="arena-track-layer">
      {rails}

      {gates}

      {exitRail}
    </div>
  );
}
