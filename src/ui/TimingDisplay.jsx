import { useProgressSelector } from '../stores/player';
import { layerColor, useTheme } from '../theme/tokens';

const timings = [
  { label: 'DNS lookup', time: 35, layer: 'application', start: 0.22, done: 0.32 },
  { label: 'TCP handshake', time: 45, layer: 'transport', start: 0.32, done: 0.42 },
  { label: 'TLS handshake', time: 100, layer: 'security', start: 0.42, done: 0.54 },
  { label: 'HTTP request', time: 200, layer: 'application', start: 0.54, done: 0.66 },
  { label: 'Page render', time: 75, layer: 'browser', start: 0.66, done: 0.94 },
];

function phase(p, t) {
  if (p < t.start) return { status: 'pending', ms: 0 };
  if (p >= t.done) return { status: 'done', ms: t.time };
  return { status: 'active', ms: Math.floor(((p - t.start) / (t.done - t.start)) * t.time) };
}

// Quantised to whole milliseconds so we re-render only when a number changes
const selectMs = (p) => timings.map((t) => phase(p, t).ms).join(',');

export default function TimingDisplay() {
  const theme = useTheme();
  const key = useProgressSelector(selectMs);
  const ms = key.split(',').map(Number);
  const total = ms.reduce((a, b) => a + b, 0);

  return (
    <div className="latency">
      <div className="latency__head">
        <span className="label">Total latency</span>
        <span className="latency__total">
          {total}
          <small>ms</small>
        </span>
      </div>
      <ul>
        {timings.map((t, i) => {
          const status = ms[i] === 0 ? 'pending' : ms[i] >= t.time ? 'done' : 'active';
          return (
            <li key={t.label} className={`is-${status}`} style={{ '--accent': layerColor(t.layer, theme) }}>
              <i />
              <span className="latency__label">{t.label}</span>
              <span className="latency__ms">
                {status === 'pending' ? '—' : status === 'done' ? `${t.time}ms` : `${ms[i]}ms`}
              </span>
              <span className="latency__bar" style={{ transform: `scaleX(${ms[i] / t.time})` }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
