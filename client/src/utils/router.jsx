import { createBrowserRouter } from "react-router";
import App from "../App";
<<<<<<< Updated upstream
import {
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
<<<<<<< Updated upstream
                element: <University />,
            },
            {
                path: "/about",
                element: "TODO: About Page",
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
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
=======
                element: <University/>,
              },
              {
                path: "/teamspage",
                element: <TeamsPage/>,
              },
              {
                  path: "/about",
                  element: "TODO: About Page",
              },
              {
                  path: "*",
                  element: <NotFound />,
              },
          ],
      },
  ]);
>>>>>>> Stashed changes

export { router };
