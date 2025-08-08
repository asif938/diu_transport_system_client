import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Auto fit bounds hook
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(positions);
    }
  }, [positions, map]);
  return null;
};

const RouteMap = ({ routeCoordinates = [] }) => {
  if (!routeCoordinates || routeCoordinates.length < 2) {
    return <p className="text-red-500">Invalid route data</p>;
  }

  return (
    <div className="w-[500px] h-[300px] rounded-lg shadow-md">
      <MapContainer
        center={routeCoordinates[0]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Auto fit bounds */}
        <FitBounds positions={routeCoordinates} />

        {/* Draw route */}
        <Polyline positions={routeCoordinates} color="blue" weight={5} />

        {/* Start Marker */}
        <Marker position={routeCoordinates[0]}>
          <Popup>Route Start</Popup>
        </Marker>

        {/* End Marker */}
        <Marker position={routeCoordinates[routeCoordinates.length - 1]}>
          <Popup>Route End</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RouteMap;
