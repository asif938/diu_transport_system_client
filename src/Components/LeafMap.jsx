import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MapUpdater from "./MapUpdater";

const BACKEND = "https://diu-transport-system-server.vercel.app";

// 🔥 FETCH BUSES FROM /api/admin/buses
const fetchBuses = async () => {
  const res = await axios.get(`${BACKEND}/api/admin/buses`);
  return res.data.data; // Extract array from { success, data }
};

export default function LeafletMap({
  selectedRoute,
  searchQuery,
  shouldCenter,
  setShouldCenter,
  defaultCenter = [23.8768956, 90.3125243],
}) {
  // Fetch buses every 3 sec
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin-buses"],
    queryFn: fetchBuses,
    refetchInterval: 3000,
    staleTime: 2000,
  });

  // Filter only ACTIVE buses + valid lat/lng
  let buses = data
    .filter((b) => b.status === "active")
    .filter((b) => b.lat !== null && b.lng !== null)
    .map((b) => ({
      busId: b.busId,
      busName: b.busName,
      busNumber: b.busNumber,
      route: b.route,
      routeId: b.routeId,
      lat: b.lat,
      lng: b.lng,
      status: b.status,
      updatedAt: b.updatedAt,
    }));

  // Filter by route
  if (selectedRoute !== "All") {
    buses = buses.filter((b) => b.route === selectedRoute);
  }

  // Search
  let searchedBus = null;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    buses = buses.filter(
      (b) =>
        b.busName.toLowerCase().includes(q) ||
        b.busNumber.toString().toLowerCase().includes(q) ||
        b.busId.toLowerCase().includes(q)
    );

    searchedBus = buses[0] || null;
  }

  // Final map center
  const finalCenter =
    shouldCenter && searchedBus
      ? [searchedBus.lat, searchedBus.lng]
      : defaultCenter;

  // Turn off auto-center after centering once
  useEffect(() => {
    if (shouldCenter && searchedBus) {
      setShouldCenter(false);
    }
  }, [shouldCenter, searchedBus]);

  // Bus icon
  const busIcon = useMemo(() => {
    const iconMarkup = renderToStaticMarkup(
      <FaBus size={24} color="#16a34a" />
    );
    return L.divIcon({
      html: iconMarkup,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
      {isLoading && (
        <div className="p-4 bg-blue-50 text-blue-700 text-center">
          Loading bus locations...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-center">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && buses.length === 0 && (
        <div className="p-4 bg-yellow-50 text-yellow-700 text-center">
          {searchQuery.trim()
            ? `No buses found matching "${searchQuery}"`
            : selectedRoute !== "All"
            ? `No buses found on route "${selectedRoute}"`
            : "No active buses found"}
        </div>
      )}

      <MapContainer
        center={finalCenter}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapUpdater
          center={finalCenter}
          zoom={13}
          active={shouldCenter && searchedBus}
        />

        {buses.map((b) => (
          <Marker key={b.busId} position={[b.lat, b.lng]} icon={busIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{b.busName}</strong> ({b.busNumber})
                <br />
                Route: {b.route}
                <br />
                Status: {b.status}
                <br />
                {b.updatedAt && (
                  <>
                    Updated:{" "}
                    {new Date(b.updatedAt).toLocaleTimeString()} <br />
                    {new Date(b.updatedAt).toLocaleDateString()}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
