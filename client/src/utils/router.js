import { createBrowserRouter } from "react-router";
import App from "../App";
import { Search } from "../pages";
import { getTest, sendTest } from "./api";

//Make an action out of an api call
const makeAction = (action) => async (params) => {
  const data = await params.request.json();
  return action(data);
};

const routes = [
  {
    path: "/",
    Component: () => "Home Page",
  },
  {
    path: "/about",
    Component: () => "About Page",
  },
  {
    path: "/search",
    Component: Search,
    action: makeAction(sendTest),
    loader: getTest,
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
