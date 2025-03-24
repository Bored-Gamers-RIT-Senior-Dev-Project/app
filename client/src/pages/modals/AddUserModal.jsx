import { Close as CloseIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router";

const AddUserModal = () => {
    const fields = [
        { label: "E-Mail" },
        { label: "Username" },
        { label: "University" },
    ];

    const navigate = useNavigate();
    const closeModal = () => navigate("..");

    return (
        <Dialog open onClose={closeModal}>
            <Box
                sx={{
                    padding: 3,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6">Add User</Typography>
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
                <Select
                    fullWidth
                    displayEmpty
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    <MenuItem value="" disabled>
                        Select Role
                    </MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Participant">Participant</MenuItem>
                </Select>
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

export { AddUserModal };
