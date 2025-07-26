import React from 'react';

const routes = [
    { name: "Route A", start: "Uttara", end: "DIU", first: "7:00 AM", last: "6:00 PM" },
    { name: "Route B", start: "Mirpur", end: "DIU", first: "7:15 AM", last: "6:30 PM" },
    { name: "Route C", start: "Dhanmondi", end: "DIU", first: "7:30 AM", last: "6:45 PM" },
];

const BusSnapshot = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-3xl font-bold text-center mb-10">Bus Route & Schedule Snapshot</h2>
                {/* <p className="text-center text-gray-600 mb-8">
                    Explore a quick overview of important routes and timings.
                </p> */}

                {/* Routes Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {routes.map((route, index) => (
                        <div key={index} className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">{route.name}</h3>
                            <p className="text-gray-600">{route.start} → {route.end}</p>
                            <p className="mt-3 text-sm text-gray-500">
                                First Departure: <span className="font-medium">{route.first}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Last Departure: <span className="font-medium">{route.last}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
                        View All Routes
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BusSnapshot;
