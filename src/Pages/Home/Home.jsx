import React from 'react';
import Features from '../../Components/Features';
import Hero from '../../Components/Hero';
import Routes from '../../Components/Routes';
import Testimonial from '../../Components/Testimonial';

const Home = () => {
    return (
        <div className=''>
            <Hero></Hero>
            <Features></Features>
            <Testimonial></Testimonial>
            <Routes></Routes>
        </div>
    );
};

export default Home;