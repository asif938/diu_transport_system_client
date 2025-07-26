import React from 'react';
import livetrtacking from '../assets/Bus_carga_trackMile.json';
import shedule from '../assets/Calendar.json';
import notification from '../assets/Email.json';
import Lottie from 'lottie-react';


const Features = () => {
    return (
        <div className='py-16 bg-gray-100'>
            <div className='max-w-screen-xl mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-12'>Our Features</h2>
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