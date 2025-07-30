import React, { useState } from 'react';
import martinez from 'polygon-clipping';

const AZURE_MAPS_KEY = process.env.REACT_APP_AZURE_MAPS_KEY;

function App() {
  const [intersection, setIntersection] = useState(null);
  const [cities, setCities] = useState([]);

  const handleIntersect = async () => {
    // Define two overlapping rectangles (GeoJSON format)
    const poly1 = [
      [
        [-122.7, 45.5],
        [-122.7, 45.6],
        [-122.6, 45.6],
        [-122.6, 45.5],
        [-122.7, 45.5]
      ]
    ];

    const poly2 = [
      [
        [-122.65, 45.55],
        [-122.65, 45.65],
        [-122.55, 45.65],
        [-122.55, 45.55],
        [-122.65, 45.55]
      ]
    ];

    // Compute intersection (for display only)
    const result = martinez.intersection(poly1, poly2);
    setIntersection(result);

    // Fetch cities using the two polygons as a GeometryCollection
    const cities = await fetchCities([poly1, poly2]);
    setCities(cities);
  };

  const fetchCities = async (polygons) => {
    // polygons: [poly1, poly2], each is an array of rings
    const geometryCollection = {
      geometry: {
        type: 'GeometryCollection',
        geometries: polygons.map(coords => ({
          type: 'Polygon',
          coordinates: coords
        }))
      }
    };

    const response = await fetch(
      `https://atlas.microsoft.com/search/geometry/json?api-version=1.0&query=city&subscription-key=${AZURE_MAPS_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geometryCollection)
      }
    );
    const json = await response.json();
    return json.results || [];
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleIntersect}>Compute Intersection & Find Cities</button>
      <pre style={{ marginTop: 20 }}>
        {intersection
          ? JSON.stringify(intersection, null, 2)
          : 'No intersection (returned null)'}
      </pre>
      <h3>Cities within Intersection:</h3>
      <ul>
        {cities.length > 0 ? (
          (() => {
            const seen = new Set();
            return cities.filter(city => {
              const key = `${city.address.municipality}|${city.address.countryCode}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            }).map((city, index) => {
              const lon = city.position?.lon ?? city.position?.[0];
              const lat = city.position?.lat ?? city.position?.[1];
              return (
                <li key={index}>
                  {city.address.municipality}, {city.address.countryCode}
                  {lat !== undefined && lon !== undefined && (
                    <span> ({lat}, {lon})</span>
                  )}
                </li>
              );
            });
          })()
        ) : (
          <li>No cities found in the intersection.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
