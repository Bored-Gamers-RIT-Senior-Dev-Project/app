import { useEffect } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";
import { ConfirmationModal } from "./ConfirmationModal";

const DeleteModal = () => {
    const navigate = useNavigate();
    const submit = usePostSubmit();
    const actionData = useActionData();

    useEffect(() => {
        if (actionData) {
            navigate("..");
        }
    }, [actionData, navigate]);

    return (
        <ConfirmationModal
            onClose={() => navigate("..")}
            onConfirm={() => submit({})}
        />
    );
};

export { DeleteModal };
