import React from 'react';
import heroimg from '../assets/3.jpg';


const Hero = () => {
    return (
        <div className='relative'>
            <img className='w-full h-[500px]' src={heroimg} alt="" />
            <div className='absolute inset-0 flex flex-col items-center justify-center space-y-8'>
                <h1 className='text-white text-4xl md:text-5xl font-bold text-center px-4'>
                    Find your route and departure times easily
                </h1>
                <p className='text-white text-center px-4 w-[1100px]'>DIU Smart Transport System makes your daily commute easier and more efficient. Instantly access real-time bus schedules, track routes, and book passes online. Stay informed about delays or changes and experience a smooth, reliable, and hassle-free transportation service designed exclusively for DIU students and faculty</p>
                <button className='bg-[#5F2DED] text-white font-semibold text-lg px-8 py-3 rounded-full border-2 border-[#5F2DED] hover:bg-white hover:text-black pointer'>Track Bus</button>
            </div>

        </div>
    );
};

export default Hero;