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
import { getUniversityInfo, search, users } from "./api";
import { events } from "./events";

/**
 * Creates an action that handles API requests with optional spinner.
 * @param {(*) => Promise<*>} action The function that handles the API call.
 * @param {boolean} [spinner=true] Whether to show a spinner during the request.
 */
const makeAction =
    (action, spinner = true) =>
    async (params) => {
        if (spinner) {
            events.publish("spinner.open");
        }
        try {
            const data = await params.request.json();
            const response = await action(data);
            return response;
        } finally {
            if (spinner) {
                events.publish("spinner.close");
            }
        }
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
                action: makeAction(users.google),
            },
            {
                path: "/signup",
                element: <UserSignUp />,
                action: makeAction(users.signUp),
            },
            {
                path: "/search",
                element: <Search />,
                action: makeAction(search),
                loader: () => search({ value: "" }),
            },
            {
                path: "/teamspage",
                element: <TeamsPage />,
            },
            {
                path: "/university/:universityId",
                element: <University />,
                loader: async ({ params }) => {
                    const { universityId } = params;
                    try {
                        if (isNaN(Number(universityId))) {
                            const error = new Error("Bad Request");
                            error.status = 404;
                            throw error;
                        }
                        return await getUniversityInfo(universityId);
                    } catch (e) {
                        if (e.status === 404) {
                            return redirect("/notfound");
                        }
                        throw e;
                    }
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
                action: makeAction(users.update),
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

export { router };
