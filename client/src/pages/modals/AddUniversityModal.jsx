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
import { useNavigate } from "react-router";

const AddUniversityModal = () => {
    const fields = [
        { label: "Name" },
        { label: "Location" },
        { label: "Rep E-Mail" },
    ];
    const navigate = useNavigate();
    const closeModal = () => navigate("..");

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
                {fields.map(({ label }, index) => (
                    <TextField
                        key={index}
                        fullWidth
                        label={label}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                ))}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: "8px", padding: "10px" }}
                >
                    Add
                </Button>
            </Box>
        </Dialog>
    );
};

export { AddUniversityModal };
