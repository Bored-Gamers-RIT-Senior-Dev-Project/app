import { createBrowserRouter } from "react-router";
import App from "../App";
import { BracketTree, Home, NotFound, Search, UserSignIn } from "../pages";
import { handleSignIn, sendTest } from "./api";
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
                path: "/bracket",
                element: <BracketTree />,
            },
            {
                path: "/signin",
                element: <UserSignIn />,
                action: makeAction(handleSignIn),
            },
            {
                path: "/search",
                element: <Search />,
                action: makeAction(sendTest),
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

export { router };
