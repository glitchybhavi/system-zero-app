import { useSelector } from 'react-redux';
import Balance from './Balance';
import { INCREMENT_VALUE } from './utils';

export default function CriticalSectionZone(props) {
  const reduxBalance = useSelector((state) => state.raceCondition.balance);
  const reduxExpected = useSelector((state) => state.raceCondition.expectedBalance);
  const reduxInc = useSelector((state) => state.raceCondition.incrementValue);

  let sharedBalance = props.sharedBalance;
  if (sharedBalance === undefined) {
    sharedBalance = reduxBalance;
  }

  let expectedBalance = props.expectedBalance;
  if (expectedBalance === undefined) {
    expectedBalance = reduxExpected;
  }

  let incVal = INCREMENT_VALUE;
  if (reduxInc !== undefined) {
    incVal = reduxInc;
  }

  const bayList = [
    { label: 'Bay 0', packet: props.busPacket0 },
    { label: 'Bay 1', packet: props.busPacket1 },
  ];

  const sockets = [];
  const conduits = [];
  for (let i = 0; i < bayList.length; i++) {
    const bay = bayList[i];

    const socketClass = `docking-socket socket-bay-${i}`;
    const conduitClass = `bus-conduit-wrapper conduit-bay-${i}`;

    sockets.push(
      <div key={`bay-${i}`} className={socketClass}>
        <span className="socket-bay-name">{bay.label}</span>
      </div>
    );

    let token = null;
    if (bay.packet.type !== null) {
      token = (
        <div key={bay.packet.id} className={`currency-token flow-${bay.packet.type}`}>
          <span className="currency-pill">₹{incVal}</span>
        </div>
      );
    }

    conduits.push(
      <div key={`conduit-${i}`} className={conduitClass}>
        <div className="bus-conduit">{token}</div>
      </div>
    );
  }

  let zoneClass = 'critical-section-zone';
  if (props.alarmActive) {
    zoneClass = zoneClass + ' vault-alarm-active';
  }

  let vaultClass = 'shared-vault-memory';
  if (props.vaultPulse) {
    vaultClass = vaultClass + ' pulse-update';
  }
  if (props.alarmActive) {
    vaultClass = vaultClass + ' vault-alarm-flash';
  }

  let lostStat = null;
  if (props.drift > 0) {
    lostStat = <span className="drift-stat">Lost: -₹{props.drift}</span>;
  }

  return (
    <section className={zoneClass}>
      <div className="cs-bays-column">
        {sockets}
      </div>

      <div className="cs-connectors-column">
        {conduits}
      </div>

      <div className={vaultClass}>
        <header className="vault-title-label">Shared Vault</header>
        <Balance value={sharedBalance} />
        <span className="vault-variable-tag">Balance</span>

        <footer className="vault-audit-stats">
          <span className="expected-stat">Expected: ₹{expectedBalance}</span>
          {lostStat}
        </footer>
      </div>

      <footer className="cs-underneath-title">Critical Section</footer>
    </section>
  );
}
