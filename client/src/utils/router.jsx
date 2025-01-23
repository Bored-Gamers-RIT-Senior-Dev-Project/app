import { createBrowserRouter } from "react-router";
import App from "../App";
import UserSignIn from "../pages/UserSignIn";
import UserSignUp from "../pages/UserSignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div>Home Page</div>,
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
        path: "/about",
        element: <div>About Page</div>,
      },
      {
        path: "*",
        element: <div>404 Page Not Found</div>,
      },
    ],
  },
]);

export { router };
