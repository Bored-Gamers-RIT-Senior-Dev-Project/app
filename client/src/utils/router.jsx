import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, NotFound, Search, UserSignIn, UserSignUp,University, Rules, Schedule} from "../pages";
import { handleSignIn, handleSignUp, sendTest } from "./api";
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
                  element: <University/>,
              },
              {
                  path: "/about",
                  element: "TODO: About Page",
              },
              {
                  path:"/rules",
                  element:<Rules />,
              },
              {
                  path: "/Schedule",
                  element: <Schedule />,
              },
              {
                  path: "*",
                  element: <NotFound />,
              },
          ],
      },
  ]);

export { router };
