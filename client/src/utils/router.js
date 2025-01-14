import { createBrowserRouter } from "react-router";
import App from "../App";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [{ path: "hello", Component: () => "Hello World!" }],
  },
]);
export { router };

