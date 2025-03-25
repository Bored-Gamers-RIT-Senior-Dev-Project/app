import { useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";
import { ConfirmationModal } from "./ConfirmationModal";

const DeleteModal = () => {
    const navigate = useNavigate();
    const submit = usePostSubmit();
    return (
        <ConfirmationModal
            onClose={() => navigate("..")}
            onConfirm={() => submit()}
        />
    );
};

export { DeleteModal };
