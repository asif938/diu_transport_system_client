import React from 'react';
import logo from '../../assets/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div>
            <Link to='/'>
                <img className='w-30' src={logo} alt="" />
            </Link>
        </div>
    );
};

export default Logo;