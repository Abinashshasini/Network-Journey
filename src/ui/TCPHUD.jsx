export default function TCPHUD({ state }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        color: '#00f2ff',
        fontFamily: 'monospace',
      }}
    >
      <h3>TCP STATE</h3>
      <p>{state}</p>
    </div>
  );
}
