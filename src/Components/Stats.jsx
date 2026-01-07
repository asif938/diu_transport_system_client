// Stats.jsx - New Component
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiClock } from 'react-icons/fi';
import { FaBus } from "react-icons/fa";

const Stats = () => {
    const stats = [
        {
            icon: <FaBus />,
            value: "50+",
            label: "Active Buses",
            description: "Modern fleet with AC & Non-AC options"
        },
        {
            icon: <FiMap />,
            value: "12+",
            label: "Routes Covered",
            description: "Across Dhaka city"
        },
        {
            icon: <FiUsers />,
            value: "25,000+",
            label: "Daily Commuters",
            description: "Students & Faculty"
        },
        {
            icon: <FiClock />,
            value: "98%",
            label: "On-time Rate",
            description: "Reliable service"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-2xl mb-6">
                                {stat.icon}
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                            <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
                            <div className="text-sm text-gray-600">{stat.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;