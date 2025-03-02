import { createBrowserRouter, redirect } from "react-router";
import App from "../App";
import {
    About,
    Home,
    NotFound,
    Rules,
    Schedule,
    Search,
    TeamsPage,
    University,
    UserSettings,
    UserSignIn,
    UserSignUp,
} from "../pages";
import { UserPreferences } from "../pages/UserPreferences.DEMO";
import {
    getUniversityInfo,
    handleSignIn,
    handleSignUp,
    search,
    updateUser,
} from "./api";
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
                action: makeAction(search),
                loader: () => search({ value: "" }),
            },
            {
                path: "/teamspage",
                element: <TeamsPage/>,
            },
            {
                path: "/university/:universityId",
                element: <University />,
                loader: async ({ params }) => {
                    const { universityId } = params;
                    console.log(parseInt(universityId));
                    if (isNaN(parseInt(universityId))) {
                        return redirect("/404");
                    }
                    return await getUniversityInfo(universityId);
                },
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
                path: "/user_preferences",
                element: <UserPreferences />,
                action: makeAction(updateUser),
            },
            {
                path: "404",
                element: <NotFound />,
            },
            {
                path: "*",
                loader: () => redirect("/404"),
            },
        ],
    },
]);

export { router };
