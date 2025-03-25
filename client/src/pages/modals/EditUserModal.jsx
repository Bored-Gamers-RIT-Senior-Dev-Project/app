import { useLoaderData, useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";
import { UserModal } from "./UserModal";

const EditUserModal = () => {
    const submit = usePostSubmit();
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    console.log(loaderData);
    const close = () => navigate("..");

    return (
        <UserModal
            defaults={{
                firstName: loaderData[2].firstName,
                lastName: loaderData[2].lastName,
                email: loaderData[2].email,
                username: loaderData[2].username,
                password: null,
                universityId: loaderData[2].universityId,
                roleId: loaderData[2].roleId,
            }}
            onSubmit={(data) => submit(data)}
            onClose={close}
        />
    );
};

export { EditUserModal };
