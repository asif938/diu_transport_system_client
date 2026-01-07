import React from "react";
import { Link } from "react-router";
import { FaBus, FaRoute, FaMapMarkedAlt, FaClock } from "react-icons/fa";

const UserHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        👋 Welcome to DIU Transport Dashboard
      </h1>

      {/* Hero / Notice Section */}
      <div className="bg-green-600 text-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold">Live Bus Tracking Now Available!</h2>
        <p className="mt-1">Track all active buses in real-time and find the best route instantly.</p>

        <Link to="/live-tracking">
          <button className="mt-4 bg-white text-green-600 px-5 py-2 rounded-lg shadow font-semibold">
            🚍 Track Live Buses
          </button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaBus className="text-green-600" size={40} />
          <div>
            <h3 className="text-xl font-bold">12 Buses</h3>
            <p className="text-gray-600">Active Fleet</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaRoute className="text-blue-600" size={40} />
          <div>
            <h3 className="text-xl font-bold">2 Routes</h3>
            <p className="text-gray-600">DSC ↔ Uttara, Dhanmondi</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaClock className="text-yellow-500" size={40} />
          <div>
            <h3 className="text-xl font-bold">Every 10–15 mins</h3>
            <p className="text-gray-600">Route Availability</p>
          </div>
        </div>
      </div>

      {/* Routes Section */}
      <h2 className="text-2xl font-bold mb-4">Available Routes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Route 1 Card */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
          <FaMapMarkedAlt className="text-blue-600 mb-3" size={35} />
          <h3 className="text-xl font-semibold">Route 1</h3>
          <p className="text-gray-600">Dhanmondi ⇄ DSC</p>

          <Link to="/live-tracking?route=Route1">
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              View Buses
            </button>
          </Link>
        </div>

        {/* Route 2 Card */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
          <FaMapMarkedAlt className="text-green-600 mb-3" size={35} />
          <h3 className="text-xl font-semibold">Route 2</h3>
          <p className="text-gray-600">Uttara ⇄ DSC</p>

          <Link to="/live-tracking?route=Route2">
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
              View Buses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
