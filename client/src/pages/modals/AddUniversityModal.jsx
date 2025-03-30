import { Close as CloseIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../../hooks/usePostSubmit";

const AddUniversityModal = () => {
    const [universityName, setUniversityName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const submit = usePostSubmit();
    const actionData = useActionData();
    const closeModal = () => navigate("..");

    /**
     * Handles changes to a form's contents
     * @param {Event} The form onChange event
     */
    const handleFormChange = ({ target }) => {
        setUniversityName(target.value);
        setMessage("");
    };

    const handleSubmit = () => {
        submit({ universityName });
    };
    useEffect(() => {
        if (actionData?.message) {
            setMessage(actionData.message);
        }
    }, [actionData]);

    return (
        <Dialog open={open} onClose={closeModal}>
            <Box
                sx={{
                    p: 3,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6">Add University</Typography>
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TextField
                    fullWidth
                    label="University Name"
                    name="universityName"
                    value={universityName}
                    onChange={handleFormChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: "8px", padding: "10px" }}
                    onClick={handleSubmit}
                >
                    Add
                </Button>
                <Typography sx={{ textAlign: "center" }}>{message}</Typography>
            </Box>
        </Dialog>
    );
};

export { AddUniversityModal };
