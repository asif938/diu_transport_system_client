// HowItWorks.jsx - New Component
import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiBell, FiCheckCircle } from 'react-icons/fi';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FiSearch />,
            title: "Find Your Route",
            description: "Search for available routes based on your location and destination",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <FiMapPin />,
            title: "Track Live Location",
            description: "View real-time bus locations and estimated arrival times",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FiBell />,
            title: "Get Notified",
            description: "Receive alerts for delays, route changes, and updates",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <FiCheckCircle />,
            title: "Board & Travel",
            description: "Check in digitally and enjoy a comfortable journey",
            color: "from-yellow-500 to-orange-500"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 max-w-screen-xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 font-semibold px-4 py-2 rounded-full mb-4">
                        <span>Simple Process</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How It
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {" "}Works
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Four simple steps to transform your daily commute
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-2xl p-8 shadow-lg text-center h-full">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {index + 1}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-5 text-white mx-auto mb-6 mt-4`}>
                                        <div className="text-3xl">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;