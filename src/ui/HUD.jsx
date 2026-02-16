import React from 'react';

const HUD = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      {/* HUD overlay will be rendered here */}
    </div>
  );
};

export default HUD;
