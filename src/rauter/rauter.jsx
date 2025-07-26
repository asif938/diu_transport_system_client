import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import TransportSchedule from "../Pages/TransportSchedule/TransportSchedule";
import FindLocation from "../Pages/FindLocation/FindLocation";
import Login from "../shared/Login/Login";
import Register from "../shared/Register/Register";

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
            }
        ]
    },
]);

export default router;