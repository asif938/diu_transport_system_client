import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeafletMap from "../../Components/LeafMap";
import useAxios from "../../hooks/useAxios";

const FindLocation = () => {
    const [selectedRoute, setSelectedRoute] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [shouldCenter, setShouldCenter] = useState(false);
    const axios = useAxios();

    // Fetch routes for dropdown
    const { data: routesRes } = useQuery({
        queryKey: ["admin-routes"],
        queryFn: async () => {
            const res = await axios.get("/api/admin/routes");
            return res.data?.data || [];
        },
    });

    const routes = routesRes || [];

    const handleSearch = () => {
        setShouldCenter(true); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="py-10 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-center text-3xl font-bold mb-3">
                    Find Your Transport Location
                </h1>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                    Select route or search bus by name/number to see real-time location.
                </p>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                    <select
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="All">All Routes</option>
                        {routes
                            .filter(route => route.status !== 'deleted')
                            .map((route) => (
                                <option key={route._id || route.routeId} value={route.title || route.routeId}>
                                    {route.title || route.routeId}
                                </option>
                            ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search by bus name or number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Map */}
                <LeafletMap 
                    selectedRoute={selectedRoute} 
                    searchQuery={searchQuery} 
                    shouldCenter={shouldCenter} 
                    setShouldCenter={setShouldCenter}
                />
            </div>
        </section>
    );
};

export default FindLocation;
