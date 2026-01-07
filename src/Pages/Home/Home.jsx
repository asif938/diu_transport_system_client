// import React from 'react';
// import Features from '../../Components/Features';
// import Hero from '../../Components/Hero';
// import Routes from '../../Components/Routes';
// import Testimonial from '../../Components/Testimonial';

// const Home = () => {
//     return (
//         <div className=''>
//             <Hero></Hero>
//             <Features></Features>
//             <Testimonial></Testimonial>
//             <Routes></Routes>
//         </div>
//     );
// };

// export default Home;



// Home.jsx - Main Home Page
import React, { useState, useEffect } from 'react';
import Features from '../../Components/Features';
import Hero from '../../Components/Hero';
import Routes from '../../Components/Routes';
import Testimonial from '../../Components/Testimonial';
import Stats from '../../Components/Stats';
import HowItWorks from '../../Components/HowItWorks';
import CTA from '../../Components/CTA';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const Home = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='overflow-hidden'>
            <Hero scrollPosition={scrollPosition} />
            <Stats />
            <Features />
            <HowItWorks />
            <Routes />
            <Testimonial />
            <CTA />
            
            {/* Floating Scroll Indicator */}
            {scrollPosition < 500 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-sm text-gray-600 mb-2">Scroll down</span>
                        <FiChevronDown className="text-2xl text-purple-600 animate-bounce" />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;