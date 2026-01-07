// import React, { useEffect, useMemo, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { renderToStaticMarkup } from "react-dom/server";
// import { FaBus } from "react-icons/fa";
// import L from "leaflet";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import MapUpdater from "./MapUpdater";

// const BACKEND = "https://diu-transport-system-server.vercel.app";

// // FETCH BUSES FROM /api/admin/buses
// const fetchBuses = async () => {
//   const res = await axios.get(`${BACKEND}/api/admin/buses`);
//   return res.data.data; // Extract array from { success, data }
// };

// export default function LeafletMap({
//   selectedRoute,
//   searchQuery,
//   shouldCenter,
//   setShouldCenter,
//   defaultCenter = [23.8768956, 90.3125243],
// }) {
//   // Fetch buses every 3 sec
//   const { data = [], isLoading, error } = useQuery({
//     queryKey: ["admin-buses"],
//     queryFn: fetchBuses,
//     refetchInterval: 3000,
//     staleTime: 2000,
//   });

//   // Filter only ACTIVE buses + valid lat/lng
//   let buses = data
//     .filter((b) => b.status === "active")
//     .filter((b) => b.lat !== null && b.lng !== null)
//     .map((b) => ({
//       busId: b.busId,
//       busName: b.busName,
//       busNumber: b.busNumber,
//       route: b.route,
//       routeId: b.routeId,
//       lat: b.lat,
//       lng: b.lng,
//       status: b.status,
//       updatedAt: b.updatedAt,
//     }));

//   // Filter by route
//   if (selectedRoute !== "All") {
//     buses = buses.filter((b) => b.route === selectedRoute);
//   }

//   // Search
//   let searchedBus = null;
//   if (searchQuery.trim()) {
//     const q = searchQuery.toLowerCase();
//     buses = buses.filter(
//       (b) =>
//         b.busName.toLowerCase().includes(q) ||
//         b.busNumber.toString().toLowerCase().includes(q) ||
//         b.busId.toLowerCase().includes(q)
//     );

//     searchedBus = buses[0] || null;
//   }

//   // Final map center
//   const finalCenter =
//     shouldCenter && searchedBus
//       ? [searchedBus.lat, searchedBus.lng]
//       : defaultCenter;

//   // Turn off auto-center after centering once
//   useEffect(() => {
//     if (shouldCenter && searchedBus) {
//       setShouldCenter(false);
//     }
//   }, [shouldCenter, searchedBus]);

//   // Bus icon
//   const busIcon = useMemo(() => {
//     const iconMarkup = renderToStaticMarkup(
//       <FaBus size={24} color="#16a34a" />
//     );
//     return L.divIcon({
//       html: iconMarkup,
//       className: "",
//       iconSize: [24, 24],
//       iconAnchor: [12, 12],
//     });
//   }, []);

//   return (
//     <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
//       {isLoading && (
//         <div className="p-4 bg-blue-50 text-blue-700 text-center">
//           Loading bus locations...
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 text-red-700 text-center">
//           Error: {error.message}
//         </div>
//       )}

//       {!isLoading && !error && buses.length === 0 && (
//         <div className="p-4 bg-yellow-50 text-yellow-700 text-center">
//           {searchQuery.trim()
//             ? `No buses found matching "${searchQuery}"`
//             : selectedRoute !== "All"
//             ? `No buses found on route "${selectedRoute}"`
//             : "No active buses found"}
//         </div>
//       )}

//       <MapContainer
//         center={finalCenter}
//         zoom={13}
//         style={{ width: "100%", height: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         <MapUpdater
//           center={finalCenter}
//           zoom={13}
//           active={shouldCenter && searchedBus}
//         />

//         {buses.map((b) => (
//           <Marker key={b.busId} position={[b.lat, b.lng]} icon={busIcon}>
//             <Popup>
//               <div className="text-sm">
//                 <strong>{b.busName}</strong> ({b.busNumber})
//                 <br />
//                 Route: {b.route}
//                 <br />
//                 Status: {b.status}
//                 <br />
//                 {b.updatedAt && (
//                   <>
//                     Updated:{" "}
//                     {new Date(b.updatedAt).toLocaleTimeString()} <br />
//                     {new Date(b.updatedAt).toLocaleDateString()}
//                   </>
//                 )}
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }







import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from './supabaseClient'; // Import supabase client
import MapUpdater from "./MapUpdater";

const BACKEND = "https://diu-transport-system-server.vercel.app";

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Calculate estimated time based on distance (assuming average bus speed of 35 km/h)
const calculateEstimatedTime = (distanceInKm) => {
  const averageSpeed = 35; // km/h
  const timeInHours = distanceInKm / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  if (timeInMinutes < 1) {
    return "Less than 1 minute";
  } else if (timeInMinutes < 60) {
    return `${timeInMinutes} minute${timeInMinutes > 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};

// Calculate bearing/direction from user to bus
const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  const bearingDegrees = (bearing * (180 / Math.PI) + 360) % 360;
  
  return bearingDegrees;
};

// Convert bearing to compass direction
const getCompassDirection = (bearing) => {
  const directions = [
    "North", "NNE", "NE", "ENE",
    "East", "ESE", "SE", "SSE",
    "South", "SSW", "SW", "WSW",
    "West", "WNW", "NW", "NNW"
  ];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

// Fetch route from OSRM (Open Source Routing Machine) - like Google Maps
const fetchRoute = async (startLat, startLng, endLat, endLng) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await axios.get(url);
    
    if (response.data.code === 'Ok' && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
      return {
        coordinates,
        distance: route.distance / 1000, // Convert to km
        duration: route.duration / 60, // Convert to minutes
        legs: route.legs || []
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
};

// FETCH BUSES FROM /api/admin/buses
const fetchBuses = async () => {
  const res = await axios.get(`${BACKEND}/api/admin/buses`);
  return res.data.data; // Extract array from { success, data }
};

// Fetch the latest location from Supabase
const fetchLastLocationFromSupabase = async () => {
  const { data, error } = await supabase
    .from('tracker1') // Assuming your table name is "tracker1"
    .select('latitude, longitude')
    .order('created_at', { ascending: false }) // Fetch the latest entry based on created_at
    .limit(1); // Only fetch the last row

  if (error) throw new Error(error.message);
  return data[0]; // Return the first (and only) record
};

export default function LeafletMap({
  selectedRoute,
  searchQuery,
  shouldCenter,
  setShouldCenter,
  defaultCenter = [23.8768956, 90.3125243],
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [routeLine, setRouteLine] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Fetch buses every 3 sec
  const { data: busData = [], isLoading: isBusLoading, error: busError } = useQuery({
    queryKey: ["admin-buses"],
    queryFn: fetchBuses,
    refetchInterval: 3000,
    staleTime: 2000,
  });

  // Fetch the last location from Supabase
  const { data: lastLocation, isLoading, error } = useQuery({
    queryKey: ["last-location"],
    queryFn: fetchLastLocationFromSupabase,
    refetchInterval: 3000, // Fetch data every 3 seconds
    staleTime: 2000, // Cache the data for 2 seconds
  });

  // Function to handle showing distance and time for a bus
  const handleShowDistance = async (bus, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!userLocation) {
      alert("Please allow location access to see distance and estimated time.");
      return;
    }
    
    setIsLoadingRoute(true);
    setSelectedBusId(bus.busId);
    
    // Fetch actual route from OSRM (like Google Maps)
    const route = await fetchRoute(
      userLocation.lat,
      userLocation.lng,
      bus.lat,
      bus.lng
    );
    
    if (route) {
      // Use actual route distance and time
      const estimatedTime = route.duration < 1 
        ? "Less than 1 minute"
        : route.duration < 60
        ? `${Math.round(route.duration)} minute${Math.round(route.duration) > 1 ? 's' : ''}`
        : `${Math.floor(route.duration / 60)} hour${Math.floor(route.duration / 60) > 1 ? 's' : ''} ${Math.round(route.duration % 60)} minute${Math.round(route.duration % 60) > 1 ? 's' : ''}`;
      
      const bearing = calculateBearing(
        userLocation.lat,
        userLocation.lng,
        bus.lat,
        bus.lng
      );
      const direction = getCompassDirection(bearing);
      
      setRouteLine(route.coordinates);
      setRouteData(route);
      setDistanceInfo({
        distance: route.distance.toFixed(2),
        time: estimatedTime,
        direction: direction,
        bearing: bearing.toFixed(1),
        route: bus.route,
      });
    } else {
      // Fallback to straight line if route fetch fails
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        bus.lat,
        bus.lng
      );
      const estimatedTime = calculateEstimatedTime(distance);
      const bearing = calculateBearing(
        userLocation.lat,
        userLocation.lng,
        bus.lat,
        bus.lng
      );
      const direction = getCompassDirection(bearing);
      
      const routeCoordinates = [
        [userLocation.lat, userLocation.lng],
        [bus.lat, bus.lng]
      ];
      
      setRouteLine(routeCoordinates);
      setRouteData(null);
      setDistanceInfo({
        distance: distance.toFixed(2),
        time: estimatedTime,
        direction: direction,
        bearing: bearing.toFixed(1),
        route: bus.route,
      });
    }
    
    setIsLoadingRoute(false);
  };

  // Function to handle hiding distance info
  const handleHideDistance = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedBusId(null);
    setDistanceInfo(null);
    setRouteLine(null);
    setRouteData(null);
  };

  // Combine the buses and the last location data
  let buses = busData
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

  // If there's a last location from Supabase, add it to the buses list
  if (lastLocation && lastLocation.latitude && lastLocation.longitude) {
    buses.push({
      busId: "last-updated", // Set a unique id for the last location
      busName: "Rojonigondha", // Label it as "Last Updated Location"
      busNumber: "2", // No number for this record
      route: "DSC<>Savar", // Not applicable
      lat: lastLocation.latitude,
      lng: lastLocation.longitude,
      status: "active", // Assuming it's active
      updatedAt: new Date().toISOString(),
    });
  }

  // Filter buses by route
  if (selectedRoute !== "All") {
    buses = buses.filter((b) => b.route === selectedRoute);
  }

  // Search functionality
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

  // Start marker icon (user location)
  const startIcon = useMemo(() => {
    const iconMarkup = renderToStaticMarkup(
      <div style={{
        backgroundColor: '#4285F4',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px'
      }}>
        <FaMapMarkerAlt />
      </div>
    );
    return L.divIcon({
      html: iconMarkup,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  // End marker icon (bus location)
  const endIcon = useMemo(() => {
    const iconMarkup = renderToStaticMarkup(
      <div style={{
        backgroundColor: '#EA4335',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px'
      }}>
        <FaBus />
      </div>
    );
    return L.divIcon({
      html: iconMarkup,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
      {isBusLoading || isLoading ? (
        <div className="p-4 bg-blue-50 text-blue-700 text-center">
          Loading locations...
        </div>
      ) : busError || error ? (
        <div className="p-4 bg-red-50 text-red-700 text-center">
          Error: {busError ? busError.message : error.message}
        </div>
      ) : buses.length === 0 ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 text-center">
          {searchQuery.trim()
            ? `No buses found matching "${searchQuery}"`
            : selectedRoute !== "All"
            ? `No buses found on route "${selectedRoute}"`
            : "No active buses found"}
        </div>
      ) : (
        <MapContainer
          center={finalCenter}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapUpdater center={finalCenter} zoom={13} active={shouldCenter && searchedBus} />

          {/* Draw route line from user to selected bus (Google Maps style) */}
          {routeLine && userLocation && (
            <>
              <Polyline
                positions={routeLine}
                color="#4285F4"
                weight={5}
                opacity={0.8}
                smoothFactor={1}
              />
              {/* Start marker (User location) */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={startIcon}>
                <Popup>
                  <div className="text-sm font-semibold">
                    📍 Your Location
                  </div>
                </Popup>
              </Marker>
              {/* End marker (Bus location) - only show if we have a selected bus */}
              {(() => {
                const selectedBus = buses.find(b => b.busId === selectedBusId);
                return selectedBus ? (
                  <Marker 
                    position={[selectedBus.lat, selectedBus.lng]} 
                    icon={endIcon}
                  >
                    <Popup>
                      <div className="text-sm font-semibold">
                        🚌 Bus Location
                      </div>
                    </Popup>
                  </Marker>
                ) : null;
              })()}
            </>
          )}

          {buses.map((b) => (
            <Marker key={b.busId} position={[b.lat, b.lng]} icon={busIcon}>
              <Popup>
                <div className="text-sm min-w-[200px]">
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
                  <br />
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    {selectedBusId === b.busId ? (
                      isLoadingRoute ? (
                        <div className="text-center py-2">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <div className="text-xs text-gray-600 mt-1">Loading route...</div>
                        </div>
                      ) : distanceInfo ? (
                        <div className="space-y-2">
                          <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
                            <div className="font-semibold text-blue-700 text-xs mb-1">ROUTE INFO</div>
                            <div className="font-semibold text-green-600 text-sm">
                              📍 Distance: {distanceInfo.distance} km
                            </div>
                            <div className="font-semibold text-blue-600 text-sm">
                              ⏱️ Estimated Time: {distanceInfo.time}
                            </div>
                          </div>
                          {/* <div className="bg-purple-50 p-2 rounded-lg border-l-4 border-purple-500">
                            <div className="font-semibold text-purple-600 text-sm">
                              🧭 Direction: {distanceInfo.direction} ({distanceInfo.bearing}°)
                            </div>
                          </div> */}
                          <div className="bg-orange-50 p-2 rounded-lg border-l-4 border-orange-500">
                            <div className="font-semibold text-orange-600 text-sm">
                              🚌 Bus Route: {distanceInfo.route}
                            </div>
                          </div>
                          {/* {routeData && (
                            <div className="text-xs text-gray-500 mt-1">
                              ✓ Route follows roads (Google Maps style)
                            </div>
                          )} */}
                          <button
                            onClick={handleHideDistance}
                            className="mt-2 w-full px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition"
                          >
                            Hide Route
                          </button>
                        </div>
                      ) : null
                    ) : (
                      <button
                        onClick={(e) => handleShowDistance(b, e)}
                        className="mt-1 w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-semibold shadow-md"
                      >
                        🗺️ Show Direction
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}






