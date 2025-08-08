import React from 'react';

const AdminHome = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to DIU Transport Dashboard</h2>
            <p className="text-gray-600 mb-6">Manage your transport system efficiently with our comprehensive dashboard.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Actions</h3>
                    <ul className="space-y-2 text-blue-700">
                        <li>• View transport schedules</li>
                        <li>• Track buses in real-time</li>
                        <li>• Manage bus applications</li>
                        <li>• Monitor system analytics</li>
                    </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Recent Activity</h3>
                    <ul className="space-y-2 text-green-700">
                        <li>• 3 new bus applications</li>
                        <li>• 2 route updates</li>
                        <li>• 5 new notices posted</li>
                        <li>• 12 active buses running</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;