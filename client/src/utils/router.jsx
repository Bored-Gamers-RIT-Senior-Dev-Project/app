import { redirect } from "react-router";
import App from "../App";
import {
    About,
    AdminDashboard,
    Home,
    NotFound,
    ReportView,
    Rules,
    Schedule,
    Search,
    TeamsPage,
    University,
    UserManager,
    UserSettings,
    UserSignIn,
    UserSignUp,
} from "../pages";
import { AddUniversityModal } from "../pages/modals/AddUniversityModal";
import { AddUserModal } from "../pages/modals/AddUserModal";
import { EditUserModal } from "../pages/modals/EditUserModal";
import { admin, search, university, users } from "./api";
import { events } from "./events";

/**
 * Creates an action that handles API requests with optional spinner.
 * @param {(*) => Promise<*>} action The function that handles the API call.
 * @param {boolean} [spinner=true] Whether to show a spinner during the request.
 */
const makeAction =
    (action, spinner = true) =>
    async (params) => {
        if (spinner) {
            events.publish("spinner.open");
        }
        try {
            const data = await params.request.json();
            const response = await action(data);
            return response;
        } finally {
            if (spinner) {
                events.publish("spinner.close");
            }
        }
    };
const routes = [
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
                action: makeAction(users.google),
            },
            {
                path: "/signup",
                element: <UserSignUp />,
                action: makeAction(users.signUp),
            },
            {
                path: "/search",
                element: <Search />,
                action: makeAction(search),
                loader: () => search({ value: "" }),
            },
            {
                path: "/teamspage",
                element: <TeamsPage />,
            },
            {
                path: "/university/:universityId",
                element: <University />,
                loader: async ({ params }) => {
                    const { universityId } = params;
                    try {
                        if (isNaN(Number(universityId))) {
                            const error = new Error("Bad Request");
                            error.status = 404;
                            throw error;
                        }
                        return await university.getInfo(universityId);
                    } catch (e) {
                        if (e.status === 404) {
                            return redirect("/notfound");
                        }
                        throw e;
                    }
                },
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/settings",
                element: <UserSettings />,
            },
            {
                path: "/rules",
                element: <Rules />,
            },
            {
                path: "/schedule",
                element: <Schedule />,
            },
            {
                path: "/admin/reports",
                element: <ReportView />,
                loader: admin.getReports,
            },
            {
                path: "/admin",
                element: <AdminDashboard />,
            },
            {
                path: "/admin/users",
                element: <UserManager />,
                children: [
                    {
                        path: "/admin/users/addUser",
                        element: <AddUserModal />,
                        loader: () =>
                            Promise.all([
                                university.getList(),
                                admin.getRoles(),
                            ]),
                        action: makeAction(users.createUser),
                    },
                    {
                        path: "/admin/users/editUser/:userId",
                        element: <EditUserModal />,
                        loader: async ({ params }) => {
                            const { userId } = params;
                            try {
                                if (isNaN(Number(userId))) {
                                    const error = new Error("Bad Request");
                                    error.status = 404;
                                    throw error;
                                }
                                return await Promise.all([
                                    university.getList(),
                                    admin.getRoles(),
                                    users.getUser(userId),
                                ]);
                            } catch (e) {
                                if (e.status === 404) {
                                    return redirect("/notfound");
                                }
                                throw e;
                            }
                        },

                        action: makeAction(users.createUser),
                    },
                    {
                        path: "/admin/users/addUniversity",
                        element: <AddUniversityModal />,
                        action: makeAction(university.addUniversity),
                    },
                ],
                loader: users.getList,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

export { routes };
