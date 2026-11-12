import { usePlayer } from '../stores/player';
import { STEPS } from '../journey/steps';
import { LAYER_LABEL, layerColor, useTheme } from '../theme/tokens';

/**
 * StepPanel — the explanation for the current step. Re-renders only when the
 * step changes. Keyed by step so the CSS enter animation replays.
 */
export default function StepPanel() {
  const stepIndex = usePlayer((s) => s.stepIndex);
  const theme = useTheme();
  const step = STEPS[stepIndex];
  const accent = layerColor(step.layer, theme);

  return (
    <aside className="step-panel" style={{ '--accent': accent }} aria-live="polite">
      <div key={stepIndex} className="step-panel__inner">
        <div className="step-panel__meta">
          <span className="step-panel__count">
            {String(stepIndex + 1).padStart(2, '0')}
            <span className="muted"> / {STEPS.length}</span>
          </span>
          <span className="layer-chip">
            <i />
            {LAYER_LABEL[step.layer]}
          </span>
        </div>

        <div className="step-panel__status">{step.status}</div>
        <h2 className="step-panel__title">{step.title}</h2>
        <p className="step-panel__desc">{step.description}</p>

        <ul className="step-panel__details">
          {step.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
