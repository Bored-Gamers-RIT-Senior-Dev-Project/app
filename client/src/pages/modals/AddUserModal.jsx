import { useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";
import { UserModal } from "./UserModal";

const AddUserModal = () => {
    const submit = usePostSubmit();
    const navigate = useNavigate();
    const close = () => navigate("..");

    return (
        <UserModal
            defaults={{
                firstName: null,
                lastName: null,
                email: null,
                username: null,
                password: null,
                universityId: null,
                roleId: 1,
            }}
            onSubmit={(data) => submit(data)}
            onClose={close}
        />
    );
};

export { AddUserModal };
