export default function DNSHUD({ state }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        color: '#55ff55',
        fontFamily: 'monospace',
      }}
    >
      <h3>DNS Resolution</h3>
      <p>{state}</p>
    </div>
  );
}
