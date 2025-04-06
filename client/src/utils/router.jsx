import { Navigate, redirect } from "react-router";
import App from "../App";
import {
    About,
    AdminDashboard,
    Faq,
    Home,
    NotFound,
    ReportView,
    Rules,
    Schedule,
    Search,
    TeamPage,
    University,
    UniversityDashboard,
    UniversityPage,
    UserSettings,
    UserSignIn,
    UserSignUp,
} from "../pages";
import { JoinTeamPage } from "../pages/JoinTeamPage";
import { AddUniversityModal } from "../pages/modals/AddUniversityModal";
import { AddUserModal } from "../pages/modals/AddUserModal";
import { DeleteModal } from "../pages/modals/DeleteModal";
import { EditUserModal } from "../pages/modals/EditUserModal";
import { admin, search, teams, university, users } from "./api";
import { events } from "./events";

/**
 * Creates an action that handles API requests with optional spinner.
 * @param {(*) => Promise<*>} action The function that handles the API call.
 * @param {boolean} [spinner=true] Whether to show a spinner during the request.
 */
const makeAction =
    (action, spinner = true) =>
    async ({ request, params }) => {
        if (spinner) {
            events.publish("spinner.open");
        }
        try {
            const data = await request.json();
            const response = await action(data, params);
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
                path: "/teams/:teamId",
                element: <TeamPage />,
                loader: ({ params }) => teams.getInfo({ id: params.teamId }),
                action: makeAction(teams.update),
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
                path: "/university/new/:universityId",
                element: <UniversityPage />,
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
                path: "/faq",
                element: <Faq />,
            },
            {
                path: "/settings",
                element: <UserSettings />,
                action: async ({ request }) => {
                    //Read formData in request
                    const formData = await request.formData();

                    //Get the userid back from the formdata and remove it
                    const userId = formData.get("userId");
                    formData.delete("userId");

                    //Send to api to process updates.
                    return users.updateSettings(userId, formData);
                },
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
                path: "/join",
                element: <JoinTeamPage />,
                loader: () =>
                    Promise.all([university.getList(), teams.getList(true)]),
                action: makeAction(teams.join),
                children: [
                    {
                        path: "/join/newTeam",
                        action: makeAction(teams.create),
                        element: <Navigate to="/join" />,
                    },
                ],
            },
            {
                path: "/admin",
                element: <AdminDashboard />,
                children: [
                    {
                        path: "/admin/addUser",
                        element: <AddUserModal />,
                        loader: () =>
                            Promise.all([
                                university.getList(),
                                admin.getRoles(),
                            ]),
                        action: makeAction(users.createUser),
                    },
                    {
                        path: "/admin/editUser/:userId",
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
                        action: makeAction(users.update),
                    },
                    {
                        path: "/admin/deleteUser/:userId",
                        element: <DeleteModal />,
                        loader: async ({ params }) => {
                            const { userId } = params;
                            try {
                                if (isNaN(Number(userId))) {
                                    const error = new Error("Bad Request");
                                    error.status = 404;
                                    throw error;
                                }
                                return await users.getUser(userId);
                            } catch (e) {
                                if (e.status === 404) {
                                    return redirect("/notfound");
                                }
                                throw e;
                            }
                        },
                        action: async ({ params }) => {
                            events.publish("spinner.open");
                            try {
                                const response = await users.delete(
                                    params.userId
                                );
                                return response;
                            } finally {
                                events.publish("spinner.close");
                            }
                        },
                    },
                    {
                        path: "/admin/addUniversity",
                        element: <AddUniversityModal />,
                        action: makeAction(university.addUniversity),
                    },
                ],
                loader: users.getList,
            },
            {
                path: "/admin/reports",
                element: <ReportView />,
                loader: admin.getReports,
            },
            {
                path: "/representative",
                element: <UniversityDashboard />,
                loader: admin.getUniversityAdminTickets,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

export { routes };
