import React, { useState } from "react";
import LeafletMap from "../../Components/LeafMap";

const FindLocation = () => {
    const [selectedRoute, setSelectedRoute] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

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
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="All">All Routes</option>
                        <option value="DSC - Dhanmondi">DSC - Dhanmondi</option>
                        <option value="DSC - Uttora">DSC - Uttora</option>
                        <option value="DSC - Mirpur">DSC - Mirpur</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search by name or number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-64"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Search
                    </button>
                </div>

                {/* Map */}
                <LeafletMap selectedRoute={selectedRoute} searchQuery={searchQuery} />

                
            </div>
        </section>
    );
};

export default FindLocation;
