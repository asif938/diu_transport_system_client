import React from 'react';
import livetrtacking from '../assets/Bus_carga_trackMile.json';
import shedule from '../assets/Calendar.json';
import notification from '../assets/Email.json';
import Lottie from 'lottie-react';


const Features = () => {
    return (
        <div className='py-16 bg-gray-100'>
            <div className='max-w-screen-xl mx-auto px-4'>
                {/* <h2 className='text-3xl font-bold text-center mb-12'>Our Features</h2> */}
                <h2 className="text-4xl text-center md:text-5xl font-bold text-gray-900 mb-8">
                        Our
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {" "}Features
                        </span>
                    </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <Lottie className='w-[280px] mx-auto' animationData={livetrtacking}></Lottie>
                        <h3 className='text-xl font-semibold mb-2'>Real-time Tracking</h3>
                        <p>Track your bus in real-time and get live updates on its location.</p>
                    </div>
                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <Lottie className='w-[280px] mx-auto' animationData={shedule}></Lottie>
                        <h3 className='text-xl font-semibold mb-2'>Route & Schedule Details</h3>
                        <p>Get detailed information about bus routes and schedules.</p>
                    </div>
                    <div className='bg-white p-6 rounded-lg shadow-md'>
                        <Lottie className='w-[280px] mx-auto' animationData={notification}></Lottie>
                        <h3 className='text-xl font-semibold mb-2'> Real-timeNotifications</h3>
                        <p>Receive notifications about delays, cancellations, and more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;











// Features.jsx - Modern Features Section
// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//     FiMap, 
//     FiClock, 
//     FiBell, 
//     FiShield, 
//     FiUsers, 
//     FiBarChart2,
//     FiNavigation,
//     FiSmartphone
// } from 'react-icons/fi';

// const Features = () => {
//     const features = [
//         {
//             icon: <FiMap />,
//             title: "Live Bus Tracking",
//             description: "Track buses in real-time with precise location updates and estimated arrival times.",
//             color: "from-purple-500 to-pink-500",
//             delay: 0.1
//         },
//         {
//             icon: <FiClock />,
//             title: "Smart Schedules",
//             description: "Access optimized routes and timings with AI-powered schedule predictions.",
//             color: "from-blue-500 to-cyan-500",
//             delay: 0.2
//         },
//         {
//             icon: <FiBell />,
//             title: "Instant Alerts",
//             description: "Get notified about delays, route changes, and important announcements.",
//             color: "from-green-500 to-emerald-500",
//             delay: 0.3
//         },
//         {
//             icon: <FiShield />,
//             title: "Safe Travel",
//             description: "Enhanced security features and emergency contact integration.",
//             color: "from-red-500 to-orange-500",
//             delay: 0.4
//         },
//         {
//             icon: <FiUsers />,
//             title: "Crowd Monitoring",
//             description: "Real-time seat availability and crowd density information.",
//             color: "from-yellow-500 to-amber-500",
//             delay: 0.5
//         },
//         {
//             icon: <FiSmartphone />,
//             title: "Mobile App",
//             description: "Complete control from your smartphone with offline capabilities.",
//             color: "from-indigo-500 to-purple-500",
//             delay: 0.6
//         }
//     ];

//     return (
//         <section className="py-20 bg-gradient-to-b from-white to-gray-50">
//             <div className="container mx-auto px-4">
//                 {/* Section Header */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     className="text-center mb-16"
//                 >
//                     <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 font-semibold px-4 py-2 rounded-full mb-4">
//                         <span>Why Choose Us</span>
//                     </div>
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//                         Smart Features for
//                         <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                             {" "}Smarter Commutes
//                         </span>
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                         Experience the future of campus transportation with our cutting-edge features
//                     </p>
//                 </motion.div>

//                 {/* Features Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {features.map((feature, index) => (
//                         <motion.div
//                             key={index}
//                             initial={{ opacity: 0, y: 30 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ delay: feature.delay }}
//                             whileHover={{ y: -10, transition: { duration: 0.2 } }}
//                             className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
//                         >
//                             {/* Background Gradient */}
//                             <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                            
//                             {/* Icon Container */}
//                             <div className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white`}>
//                                 <div className="text-2xl">
//                                     {feature.icon}
//                                 </div>
//                                 {/* Number Badge */}
//                                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
//                                     <span className="text-sm font-bold text-gray-900">0{index + 1}</span>
//                                 </div>
//                             </div>

//                             {/* Content */}
//                             <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
//                                 {feature.title}
//                             </h3>
//                             <p className="text-gray-600 mb-4">
//                                 {feature.description}
//                             </p>

//                             {/* Learn More Link */}
//                             <div className="flex items-center text-purple-600 font-medium">
//                                 <span className="mr-2">Learn more</span>
//                                 <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                                 </svg>
//                             </div>

//                             {/* Hover Border Effect */}
//                             <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* Stats Bar */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
//                 >
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                         {[
//                             { value: "50+", label: "Buses" },
//                             { value: "12+", label: "Routes" },
//                             { value: "25k+", label: "Students" },
//                             { value: "98%", label: "On-time Rate" }
//                         ].map((stat, index) => (
//                             <div key={index} className="text-center">
//                                 <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
//                                 <div className="text-gray-200">{stat.label}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </motion.div>
//             </div>
//         </section>
//     );
// };

// export default Features;