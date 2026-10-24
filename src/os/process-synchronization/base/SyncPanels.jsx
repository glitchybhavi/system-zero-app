export function StateHudPanel(props) {
  return (
    <aside className="mutex-hud-panel">
      <header className="mutex-hud-header">
        <span>{props.title}</span>
      </header>
      {props.children}
    </aside>
  );
}

export function HudRow(props) {
  return (
    <div className="mutex-hud-row">
      <span style={{ color: props.labelColor }}>{props.label}</span>
      <output style={{ color: props.valueColor, fontWeight: 700 }}>{props.value}</output>
    </div>
  );
}
