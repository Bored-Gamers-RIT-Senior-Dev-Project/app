import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, UserSignIn, UserSignUp } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        element: Home,
      },
      {
        path: "/signin",
        Component: UserSignIn,
      },
      {
        path: "/signup",
        Component: UserSignUp,
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
