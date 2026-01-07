// import React from 'react';
// import heroimg from '../assets/3.jpg';
// import { Link } from 'react-router';



// const Hero = () => {
//     return (
//         <div className='relative'>
//             <img className='w-full h-[500px]' src={heroimg} alt="" />
//             <div className='absolute inset-0 flex flex-col items-center justify-center space-y-8'>
//                 <h1 className='text-white text-4xl md:text-5xl font-bold text-center px-4'>
//                     Find your route and departure times easily
//                 </h1>
//                 <p className='text-white text-center px-4 w-[1100px]'>DIU Smart Transport System makes your daily commute easier and more efficient. Instantly access real-time bus schedules, track routes, and book passes online. Stay informed about delays or changes and experience a smooth, reliable, and hassle-free transportation service designed exclusively for DIU students and faculty</p>

//                 <Link to='/transportLocation'><button className='bg-[#5F2DED] text-white font-semibold text-lg px-8 py-3 rounded-full border-2 border-[#5F2DED] hover:bg-white hover:text-black cursor-pointer'>Track Bus</button></Link>

//             </div>

//         </div>
//     );
// };

// export default Hero;


// Hero.jsx - Enhanced Hero Section (Corrected)
import React from 'react';
import { Link } from 'react-router';
// import heroimg from '../assets/hero-bus.jpg'; // Use a better quality image
// If you don't have hero-bus.jpg, use your existing image:
import heroimg from '../assets/3.jpg'; 
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi';

const Hero = ({ scrollPosition = 0 }) => { // Added default value for scrollPosition
    const parallaxOffset = scrollPosition * 0.5;

    return (
        <section className="relative py-10 flex items-center justify-center overflow-hidden">
            {/* Background with Parallax Effect */}
            <motion.div 
                style={{ y: parallaxOffset }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 z-10"></div>
                <img 
                    src={heroimg} 
                    alt="DIU Bus Transport" 
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-1">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, Math.sin(i) * 20, 0]
                        }}
                        transition={{
                            duration: 3 + i * 0.2,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                        style={{
                            left: `${(i * 5) % 100}%`,
                            top: `${(i * 7) % 100}%`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Animated Badge */}
                    {/* <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-white text-sm font-medium">Live Tracking Available</span>
                    </motion.div> */}

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        <span className="block">Smart Transport</span>
                        <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            For DIU Community
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                        Experience seamless commuting with real-time bus tracking, intelligent scheduling, 
                        and reliable transportation services designed exclusively for DIU students and faculty.
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mb-10 px-4">
                        {[
                            { icon: <FiMapPin />, label: "Live Tracking", value: "Real-time" },
                            { icon: <FiClock />, label: "On-time", value: "98%" },
                            { icon: <FiNavigation />, label: "Routes", value: "12+" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[140px]"
                            >
                                <div className="text-2xl text-white mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-gray-300">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/transportLocation">
                                <button className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl border-0 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-3">
                                    <span>Track Bus Live</span>
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
                            <Link to="/transportSchedule">
                                <button className="group bg-white/10 backdrop-blur-sm text-white font-semibold text-lg px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    View Schedules
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            {/* <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
            >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                </div>
            </motion.div> */}

            {/* Wave Decoration */}
            {/* <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
                    <path 
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                        fill="#ffffff" 
                        opacity="1"
                    />
                </svg>
            </div> */}
        </section>
    );
};

export default Hero;