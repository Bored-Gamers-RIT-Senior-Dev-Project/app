import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserSignUp from "../components/Auth/UserSignUp";
import UserSignIn from "../components/Auth/UserSignIn"; // Ensure you import the sign-in component if needed

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
        path: "/signin", // Adding the sign-in route explicitly
        element: <UserSignIn />,
      },
      {
        path: "/signup", // Ensure this points to UserSignUp
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
