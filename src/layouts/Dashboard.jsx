import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import {
    FaHome,
    FaBus,
    FaMapMarkedAlt,
    FaCalendarAlt,
    FaBell,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaChartBar,
    FaUsers,
    FaRoute,
    FaClipboardList
} from 'react-icons/fa';
import logo from '../assets/logo.png';
import Logo from '../shared/Logo/Logo';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // for testing admin panel or user panel. running isadmin = true we will make our first admin.
    const isAdmin = true;
    // const isAdmin = false;


    // Dashboard navigation items

    const adminNavItems = [
        {
            name: 'Home',
            icon: <FaHome />,
            path: '/dashboard/adminhome',
            badge: null
        },
        {
            name: 'Bus Management',
            icon: <FaBus />,
            path: '/dashboard/busmanagement',
            badge: null
        },
        {
            name: 'Transport Schedule',
            icon: <FaCalendarAlt />,
            path: '/dashboard/schedule',
            badge: null
        },
        {
            name: 'Live Tracking',
            icon: <FaMapMarkedAlt />,
            path: '/dashboard/transportLocation',
            badge: 'Live'
        },
        {
            name: 'Users',
            icon: <FaUsers />,
            path: '/dashboard/users',
            badge: null
        },
        {
            name: 'Bus Applications',
            icon: <FaClipboardList />,
            path: '/dashboard/applications',
            badge: '3'
        },
        {
            name: 'Analytics',
            icon: <FaChartBar />,
            path: '/dashboard/analytics',
            badge: null
        },
        {
            name: 'Notices',
            icon: <FaBell />,
            path: '/dashboard/notices',
            badge: '5'
        }

    ];

    const userNavItems = [
        {
            name: 'Home',
            icon: <FaHome />,
            path: '/dashboard/userhome',
            badge: null
        },
        {
            name: 'Live Tracking',
            icon: <FaMapMarkedAlt />,
            path: '/dashboard/transportLocation',
            badge: 'Live'
        },
        {
            name: 'Bus Routes',
            icon: <FaRoute />,
            path: '/dashboard/transportSchedule',
            badge: null
        },
        {
            name: 'Notices',
            icon: <FaBell />,
            path: '/dashboard/notice',
            badge: null
        },
        {
            name: 'Apply For Bus',
            icon: <FaBus />,
            path: '/dashboard/applybus',
            badge: null
        },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;
 

    // Quick stats data
    const quickStats = [
        {
            title: 'Active Buses',
            value: '12',
            change: '+2',
            changeType: 'positive',
            icon: <FaBus className="text-blue-500" />
        },
        {
            title: 'Total Routes',
            value: '8',
            change: '+1',
            changeType: 'positive',
            icon: <FaRoute className="text-green-500" />
        },
        {
            title: 'Active Users',
            value: '1,247',
            change: '+23',
            changeType: 'positive',
            icon: <FaUsers className="text-purple-500" />
        },
        {
            title: 'Pending Applications',
            value: '15',
            change: '-3',
            changeType: 'negative',
            icon: <FaClipboardList className="text-orange-500" />
        }
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Logo></Logo>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item.badge === 'Live'
                                            ? 'bg-green-100 text-green-800'
                                            : item.badge === '3' || item.badge === '5'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <NavLink
                            to="/"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaHome className="mr-3 text-lg" />
                            <span>Home</span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/profile"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaUser className="mr-3 text-lg" />
                            <span>Profile</span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/settings"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaCog className="mr-3 text-lg" />
                            <span>Settings</span>
                        </NavLink>
                        <button className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                            <FaSignOutAlt className="mr-3 text-lg" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <FaBars className="h-5 w-5" />
                        </button>

                        {/* Page Title */}
                        <div className="flex-1 lg:flex-none">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {/* {isAdmin ? 'Admin Dashboard' : 'User Dashboard'} */}
                                {location.pathname === '/dashboard/adminhome' ? 'Admin Dashboard' :
                                  location.pathname === '/dashboard/userhome' ? 'User Dashboard':
                                    location.pathname.includes('schedule') ? 'Transport Schedule' :
                                        location.pathname.includes('tracking') ? 'Live Tracking' :
                                            location.pathname.includes('routes') ? 'Bus Routes' :
                                                location.pathname.includes('applications') ? 'Bus Applications' :
                                                    location.pathname.includes('users') ? 'Users' :
                                                        location.pathname.includes('analytics') ? 'Analytics' :
                                                            location.pathname.includes('notices') ? 'Notices' :
                                                                'Dashboard'}
                            </h1>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                                <FaBell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaUser className="h-4 w-4 text-white" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                                    <p className="text-xs text-gray-500">admin@diu.edu.bd</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {/* Quick Stats - Only show on dashboard overview */}
                    {location.pathname === '/dashboard/adminhome' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {quickStats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {stat.change}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                                                </div>
                                            </div>
                                            <div className="text-2xl">
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <div className="px-6 pb-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Dashboard;