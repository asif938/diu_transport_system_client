import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { NavLink } from "react-router";
import Logo from "./Logo/Logo";
import './navbar.css'


const Navbar = () => {
    const { user, SignOutUser, role } = useContext(AuthContext);

    const handleSignOut = () => {
        SignOutUser().catch((err) => console.error("Logout Error:", err));
    };

    const navLinks = (
        <div className='flex md:flex-row flex-col gap-4'>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/transportSchedule">Transport Schedule</NavLink></li>
            <li><NavLink to="/transportLocation">Find Location</NavLink></li>
            {/* <li><NavLink to="/borrow-bus">Apply for Bus</NavLink></li> */}
            <li><NavLink to="/notice">Notice</NavLink></li>
            {user && (
                <li>
                    <NavLink to={role === 'admin' ? '/adminDashboard' : '/dashboard'}>
                        Dashboard
                    </NavLink>
                </li>
            )}
        </div>
    );

    return (
        <div className="bg-base-100 shadow-sm sticky top-0 z-50">
            <div className='navbar max-w-screen-xl mx-auto'>
                {/* Navbar Start - Mobile Menu & Logo */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100 z-50">
                            {navLinks}
                        </ul>
                    </div>
                    <Logo />
                </div>

                {/* Navbar Center - Links */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-semibold">
                        {navLinks}
                    </ul>
                </div>

                {/* Navbar End - Auth Buttons */}
                <div className="navbar-end space-x-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={user.photoURL || "https://i.ibb.co/2M5FJxC/default-user.png"}
                                alt="User"
                                className="w-10 h-10 rounded-full border"
                            />
                            <button
                                onClick={handleSignOut}
                                className="btn btn-outline btn-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn">Login</NavLink>
                            <NavLink to="/register" className="btn">Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
