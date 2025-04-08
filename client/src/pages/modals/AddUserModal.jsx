import { useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";
import { UserModal } from "./UserModal";

const AddUserModal = () => {
    const submit = usePostSubmit();
    const navigate = useNavigate();
    const close = () => navigate("..");

    return (
        <UserModal
            label="Add"
            defaults={{
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                password: "",
                universityId: null,
                roleId: 1,
            }}
            onSubmit={(data) => submit(data)}
            onClose={close}
            passwordRequired
        />
    );
};

export { AddUserModal };
