import React, { useState } from 'react';
import martinez from 'polygon-clipping';

function App() {
  const [intersection, setIntersection] = useState(null);

  const handleIntersect = () => {
    // Two overlapping rectangles for guaranteed intersection
    // polygon-clipping expects: Array of rings, each ring is array of [x, y]
    const poly1 = [[
      [-122.7, 45.5],
      [-122.7, 45.6],
      [-122.6, 45.6],
      [-122.6, 45.5],
      [-122.7, 45.5]
    ]];

    const poly2 = [[
      [-122.65, 45.55],
      [-122.65, 45.65],
      [-122.55, 45.65],
      [-122.55, 45.55],
      [-122.65, 45.55]
    ]];

    const result = martinez.intersection(poly1, poly2);
    setIntersection(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleIntersect}>Compute Intersection</button>
      <pre style={{ marginTop: 20 }}>
        {intersection
          ? JSON.stringify(intersection, null, 2)
          : 'No intersection (returned null)'}
      </pre>
    </div>
  );
}

export default App;
