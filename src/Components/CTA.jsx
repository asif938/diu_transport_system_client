// CTA.jsx - New Component
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FiDownload, FiSmartphone } from 'react-icons/fi';

const CTA = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready for a
                        <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Smarter Commute?
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                        Join thousands of DIU students and faculty who trust our transport system
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/register">
                                <button className="group bg-white text-purple-900 font-bold text-lg px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center gap-3">
                                    <span>Get Started Free</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="group bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3">
                                <FiSmartphone className="text-xl" />
                                <span>Download App</span>
                                <FiDownload className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* App Store Badges */}
                    <div className="flex justify-center gap-6 mt-10">
                        <button className="bg-black/30 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-black/50 transition-all">
                            <div className="text-2xl">🍎</div>
                            <div className="text-left">
                                <div className="text-xs text-gray-400">Download on the</div>
                                <div className="text-white font-semibold">App Store</div>
                            </div>
                        </button>
                        
                        <button className="bg-black/30 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-black/50 transition-all">
                            <div className="text-2xl">▶️</div>
                            <div className="text-left">
                                <div className="text-xs text-gray-400">Get it on</div>
                                <div className="text-white font-semibold">Google Play</div>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;