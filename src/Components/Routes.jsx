// import React from 'react';

// import { Link } from 'react-router';


// const routes = [
//     { name: "Route A", start: "Uttara", end: "DIU", first: "7:00 AM", last: "6:00 PM" },
//     { name: "Route B", start: "Mirpur", end: "DIU", first: "7:15 AM", last: "6:30 PM" },
//     { name: "Route C", start: "Dhanmondi", end: "DIU", first: "7:30 AM", last: "6:45 PM" },
// ];

// const BusSnapshot = () => {
//     return (
//         <section className="py-12 bg-gray-50">
//             <div className="max-w-6xl mx-auto px-4">
//                 {/* Section Title */}
//                 <h2 className="text-3xl font-bold text-center mb-10">Bus Route & Schedule Snapshot</h2>
//                 {/* <p className="text-center text-gray-600 mb-8">
//                     Explore a quick overview of important routes and timings.
//                 </p> */}

//                 {/* Routes Grid */}
//                 <div className="grid md:grid-cols-3 gap-6">
//                     {routes.map((route, index) => (
//                         <div key={index} className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
//                             <h3 className="text-xl font-semibold mb-2">{route.name}</h3>
//                             <p className="text-gray-600">{route.start} → {route.end}</p>
//                             <p className="mt-3 text-sm text-gray-500">
//                                 First Departure: <span className="font-medium">{route.first}</span>
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Last Departure: <span className="font-medium">{route.last}</span>
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* View All Button */}
//                 <div className="text-center mt-10">

//                     <Link to='/transportSchedule'>
//                         <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
//                         View All Routes
//                         </button>
//                     </Link>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BusSnapshot;






// Routes.jsx - Enhanced Version
import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiUsers, FiNavigation } from 'react-icons/fi';

const routes = [
    { 
        name: "Uttara Route", 
        start: "Uttara", 
        end: "DIU Campus", 
        first: "7:00 AM", 
        last: "8:00 PM",
        buses: 12,
        duration: "45 min",
        color: "from-purple-500 to-pink-500"
    },
    { 
        name: "Mirpur Route", 
        start: "Mirpur", 
        end: "DIU Campus", 
        first: "7:15 AM", 
        last: "8:15 PM",
        buses: 10,
        duration: "40 min",
        color: "from-blue-500 to-cyan-500"
    },
    { 
        name: "Dhanmondi Route", 
        start: "Dhanmondi", 
        end: "DIU Campus", 
        first: "7:30 AM", 
        last: "8:30 PM",
        buses: 8,
        duration: "35 min",
        color: "from-green-500 to-emerald-500"
    },
];

const BusSnapshot = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 font-semibold px-4 py-2 rounded-full mb-4">
                        <span>Popular Routes</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Explore Our
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {" "}Major Routes
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connect to DIU from all major locations across Dhaka
                    </p>
                </motion.div>

                {/* Routes Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {routes.map((route, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Gradient Top */}
                            <div className={`h-3 bg-gradient-to-r ${route.color}`}></div>
                            
                            <div className="p-8">
                                {/* Route Name */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{route.name}</h3>
                                
                                {/* Route Path */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-center">
                                        <FiMapPin className="text-green-500 text-2xl mx-auto mb-2" />
                                        <div className="font-semibold text-gray-800">{route.start}</div>
                                    </div>
                                    <div className="flex-1 px-4">
                                        <div className="relative h-1 bg-gradient-to-r from-gray-300 to-gray-300">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${route.color}`}></div>
                                            <FiNavigation className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <FiMapPin className="text-red-500 text-2xl mx-auto mb-2" />
                                        <div className="font-semibold text-gray-800">{route.end}</div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <FiClock className="text-gray-600 mx-auto mb-1" />
                                        <div className="text-sm text-gray-600">First Bus</div>
                                        <div className="font-bold text-gray-900">{route.first}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <FiClock className="text-gray-600 mx-auto mb-1" />
                                        <div className="text-sm text-gray-600">Last Bus</div>
                                        <div className="font-bold text-gray-900">{route.last}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <FiUsers className="text-gray-600 mx-auto mb-1" />
                                        <div className="text-sm text-gray-600">Buses</div>
                                        <div className="font-bold text-gray-900">{route.buses}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <FiNavigation className="text-gray-600 mx-auto mb-1" />
                                        <div className="text-sm text-gray-600">Duration</div>
                                        <div className="font-bold text-gray-900">{route.duration}</div>
                                    </div>
                                </div>

                                {/* View Schedule Button */}
                                <button className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all group-hover:shadow-lg">
                                    View Live Schedule
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link to='/transportSchedule'>
                        <button className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 overflow-hidden">
                            <span className="relative z-10">Explore All Routes & Schedules</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default BusSnapshot;