import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, Search, UserSignIn, UserSignUp } from "../pages";
import { getTest, sendTest } from "./api";

//Make an action out of an api call
const makeAction = (action) => async (params) => {
  const data = await params.request.json();
  return action(data);
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
      },
      {
        path: "/signup",
        element: <UserSignUp />,
      },
      {
        path: "/search",
        element: <Search />,
        action: makeAction(sendTest),
        loader: getTest,
      },
      {
        path: "/about",
        element: "TODO: About Page",
      },
      {
        path: "*",
        element: "TODO: 404 Page",
      },
    ],
  },
]);

export { router };
