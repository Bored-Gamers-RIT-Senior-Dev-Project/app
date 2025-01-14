import { createBrowserRouter } from "react-router";
import App from "../App";

const routes = [
  {
    path: "/",
    Component: () => "Home Page",
  },
  {
    path: "/about",
    Component: () => "About Page",
  },
  { path: "*", Component: () => "404 Page" },
];

//Create a router instance with our defined routes
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: routes,
  },
]);
export { router };
