import React, { useState } from "react";
import { FiClock, FiMapPin, FiSearch, FiFilter, FiAlertTriangle } from "react-icons/fi";
import { MdDirectionsBus, MdSchedule } from "react-icons/md";
import { MapContainer, TileLayer, Polyline, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ routeCoordinates }) => {
  const centerPosition = routeCoordinates[0];
  
  return (
    <MapContainer 
      center={centerPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline 
        positions={routeCoordinates} 
        color="blue"
        weight={5}
        opacity={0.7}
      />
      <Marker position={routeCoordinates[0]}>
        <Popup>Starting Point</Popup>
      </Marker>
      <Marker position={routeCoordinates[routeCoordinates.length - 1]}>
        <Popup>Destination</Popup>
      </Marker>
    </MapContainer>
  );
};

const routesData = [
  {
    routeNo: "Route 1",
    routeName: "Dhanmondi <> DSC",
    startTime: ["08:00 AM", "09:00 AM"],
    departureTime: ["06:00 PM", "07:00 PM"],
    details: "Dhanmondi - Sobhanbag <> Shyamoli Square <> Technical Mor <> Majar Road Gabtoli <> Konabari Bus Stop <> Eastern Housing<> Rupnagar <> Birulia Bus Stand <> Daffodil Smart City",
    coordinates: [
      [23.746, 90.376], // DSC
      [23.750, 90.375],
      [23.770, 90.370],
      [23.790, 90.370],
      [23.810, 90.370],
      [23.830, 90.375],
      [23.850, 90.380],
      [23.870, 90.385],
      [23.890, 90.370],
      [23.880, 90.350],
      [23.874, 90.320], // Dhanmondi
    ],
  },
  {
    routeNo: "Route 2",
    routeName: "Tongi College Gate <> DSC",
    startTime: ["07:00 AM", "10:00 AM", "02:15 PM"],
    departureTime: ["01:30 PM", "04:20 PM", "06:10 PM"],
    details: "Tongi College Gate Bus Stand <> Kamar Para <> Dhour <> Birulia <> Daffodil Smart City",
    coordinates: [
      [23.9115, 90.3210], // DSC
      [23.8405, 90.3350],
      [23.9200, 90.3700],
      [23.9105, 90.3900],
      [23.9013, 90.4044], // Tongi College Gate
    ],
  },

  {
    routeNo: "Route 3",
    routeName: "Uttara - Rajlokkhi <> DSC",
    startTime: ["08:00 AM", "09:00 AM"],
    departureTime: ["06:00 PM", "07:00 PM"],
    details: "Uttara - Rajlokkhi <> House building <> Grand Zamzam Tower <> Uttara Metro rail Center<>Diyabari Bridge <> Beribadh <> Birulia <> Khagan <> Daffodil Smart City",
    coordinates: [
      [23.874, 90.320], //DSC
      [23.880, 90.350],
      [23.890, 90.370], //Uttara - Rajlokkhi 
    ],
  },
{
        routeNo: "Route 04",
        routeName: "Mirpur-1, Sony Cinema Hall <> DSC",
        startTime: ["07:00 AM", "08:30 AM", "10:00 AM", "12:00 PM"],
        departureTime: ["11:15 AM (will go upto Mirpur-1 only)", "04:20 PM (will go upto Mirpur-10 only)"],
        details: "Sony Cinema Hall <> Gudaraghat <> Beribadh <> Estern Housing <> Birulia <> Akran <> Daffodil Smart City",
        coordinates: [
            [23.8103, 90.3667],
            [23.8223, 90.3555],
            [23.8285, 90.3501],
            [23.8355, 90.3450],
            [23.8405, 90.3350],
            [23.8500, 90.3300],
            [23.9115, 90.3210],
        ],
    },

];


const TransportSchedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoute, setFilterRoute] = useState("");

  const routeNumbers = [...new Set(routesData.map(route => route.routeNo))];

  const filteredRoutes = routesData.filter(route => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      route.routeNo.toLowerCase().includes(searchLower) ||
      route.routeName.toLowerCase().includes(searchLower) ||
      route.details.toLowerCase().includes(searchLower);

    const matchesFilter = filterRoute ? route.routeNo === filterRoute : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-800 flex items-center justify-center gap-2">
          <MdDirectionsBus className="text-3xl" /> DIU Transport Schedule
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative w-full md:w-1/4">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Routes</option>
              {routeNumbers.map((no, index) => (
                <option key={index} value={no}>{no}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
          <div className="flex items-start">
            <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Buses cannot be borrowed during their scheduled route times shown below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, index) => (
              <div key={index} className="border rounded-xl shadow-sm p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {route.routeNo}
                      </h2>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {route.routeName}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <FiClock /> <span className="font-medium">To DSC</span>
                        </div>
                        <ul className="space-y-1">
                          {route.startTime.map((time, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                {time}
                              </span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Busy
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <FiClock /> <span className="font-medium">From DSC</span>
                        </div>
                        <ul className="space-y-1">
                          {route.departureTime.map((time, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                {time}
                              </span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Busy
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FiMapPin /> <span className="font-medium">Route Details</span>
                      </div>
                      <p className="text-gray-700">{route.details}</p>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="bg-gray-100 rounded-lg p-4 h-full">
                      <div className="h-48 w-full rounded overflow-hidden">
                        <RouteMap routeCoordinates={route.coordinates} />
                      </div>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <MdSchedule /> View Full Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No routes found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportSchedule;