import { createBrowserRouter } from "react-router";
import App from "../App";
import { UserSignIn, UserSignUp } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: () => "Home Page",
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
        Component: () => "About Page",
      },
      {
        path: "*",
        Component: () => "404 Page Not Found",
      },
    ],
  },
]);

export { router };
