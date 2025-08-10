import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../layouts/Dashboard";
import Home from "../Pages/Home/Home";
import TransportSchedule from "../Pages/TransportSchedule/TransportSchedule";
import FindLocation from "../Pages/FindLocation/FindLocation";
import Login from "../shared/Login/Login";
import Register from "../shared/Register/Register";
import BorrowBus from "../Pages/BorrowBus/BorrowBus";
import Notice from "../Pages/Notice/Notice";
import AdminHome from "../Pages/Dashboard/AdminHome/AdminHome";
import Schedules from "../Pages/Dashboard/Schedules/Schedules";
import BusApplications from "../Pages/Dashboard/BusApplications/BusApplications";
import Users from "../Pages/Dashboard/Users/Users";


const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/transportSchedule",
                Component: TransportSchedule
            },
            {
                path: "/transportLocation",
                Component: FindLocation
            },
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/register",
                Component: Register
            },
            {
                path: "/borrow-bus",
                Component: BorrowBus
            },
            {
                path: "/notice",
                Component: Notice
            }
        ]
    },
    {
        path: "/dashboard",
        Component: Dashboard,
        children: [
            //normal user routes
            {
                path: "userhome",
                element: <h1>User HOme</h1>
            },
            {

                path: "transportLocation",
                Component: FindLocation

            },
            {
                path: "notice",
                Component: Notice
            },
            {
                path: "transportSchedule",
                Component: TransportSchedule
            },
            {
                path: "applybus",
                Component: BorrowBus
            },

            //admin only routes
            {
                // index: true,
                path: "adminhome",
                Component: AdminHome
            },
            {
                path: "busmanagement",
                element: <h1>Bus Management</h1>
            },
            {
                path: "schedule",
                Component: Schedules
            },         
            {
                path: "applications",
                Component: BusApplications
            },
            {
                path: "users",
                Component: Users
            },
            {
                path: "analytics",
                element: <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            },
            {
                path: "notices",
                element: <h2 className="text-2xl font-bold">Notice Management</h2>
            },

            // shared routes(this will be shown in any users dashboard)
            {
                path: "profile",
                element: <h2 className="text-2xl font-bold">User Profile</h2>
            },
            {
                path: "settings",
                element: <h2 className="text-2xl font-bold">System Settings</h2>
            }
        ]
    }
]);

export default router;