import { createBrowserRouter } from "react-router";
import App from "../App";
import {
    Home,
    NotFound,
    Rules,
    Schedule,
    Search,
    University,
    About,
    UserSettings,
    UserSignIn,
    UserSignUp,
    ReportView,
    AdminDashboard,
    UserManager
} from "../pages";
import { UserPreferences } from "../pages/UserPreferences.DEMO";
import { handleSignIn, handleSignUp, sendTest, updateUser } from "./api";
import { events } from "./events";

//Make an action out of an api call
const makeAction =
    (action, spinner = true) =>
    async (params) => {
        if (spinner) events.publish("spinner.open");
        const data = await params.request.json();
        const response = await action(data);
        if (spinner) events.publish("spinner.close");
        return response;
    };
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/signin",
                element: <UserSignIn />,
                action: makeAction(handleSignIn),
            },
            {
                path: "/signup",
                element: <UserSignUp />,
                action: makeAction(handleSignUp),
            },
            {
                path: "/search",
                element: <Search />,
                action: makeAction(sendTest),
            },
            {
                path: "/university/:universityId",
                element: <University />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/settings",
                element: <UserSettings />,
            },
            {
                path: "/rules",
                element: <Rules />,
            },
            {
                path: "/schedule",
                element: <Schedule />,
            },
            {
                path: "/admin/reports",
                element: <ReportView />,
            },
            {
                path:"/admin",
                element: <AdminDashboard />,
            },
            {
                path:"/admin/users",
                element: <UserManager />,
            },
            {
                path: "/user_preferences",
                element: <UserPreferences />,
                action: makeAction(updateUser),
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

export { router };