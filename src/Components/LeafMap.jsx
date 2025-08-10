import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapUpdater from "./MapUpdater";

const LeafletMap = ({ selectedRoute, searchQuery }) => {
const buses = [
  { id: 1, route: "DSC - Dhanmondi", busName: "Surjomukhi", busNumber: "12", position: [23.780399, 90.354244], status: "On Time" },
  { id: 2, route: "DSC - Dhanmondi", busName: "Surjomukhi", busNumber: "19", position: [23.774667, 90.365644], status: "On Time" },
  { id: 3, route: "DSC - Uttora", busName: "D Link", busNumber: "10", position: [23.874189, 90.385496], status: "5 min late" },
  { id: 4, route: "DSC - Mirpur", busName: "Rojonigondha", busNumber: "6", position: [23.796957, 90.350486], status: "Delayed" },

];


  // Filter by route + search
  const filteredBuses = useMemo(() => {
    let result = selectedRoute === "All" ? buses : buses.filter(b => b.route === selectedRoute);

    if (searchQuery.trim()) {
      const parts = searchQuery.trim().split(" ");
      const namePart = parts[0];
      const numberPart = parts[1];

      if (numberPart) {
        // Exact busName + busNumber
        result = result.filter(
          b =>
            b.busName.toLowerCase() === namePart.toLowerCase() &&
            b.busNumber === numberPart
        );
      } else {
        // Only by name
        result = result.filter(b =>
          b.busName.toLowerCase().includes(namePart.toLowerCase())
        );
      }
    }
    return result;
  }, [selectedRoute, searchQuery]);


  // center map to first bus
  const mapCenter = filteredBuses.length > 0 ? filteredBuses[0].position : [23.780399, 90.354244];

  const iconMarkup = renderToStaticMarkup(<FaBus size={28} color="#16a34a" />);
  const busIcon = L.divIcon({ html: iconMarkup, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });

  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
      <MapContainer center={mapCenter} zoom={14} style={{ width: "100%", height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={mapCenter} />

        {filteredBuses.map((bus) => (
          <Marker key={bus.id} position={bus.position} icon={busIcon}>
            <Popup>
              <strong>{bus.busName}</strong> ({bus.busNumber}) <br />
              Route: {bus.route} <br />
              Status: {bus.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
