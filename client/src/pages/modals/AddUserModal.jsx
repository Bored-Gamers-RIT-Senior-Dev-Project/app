import { Close as CloseIcon } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    FormControl,
    IconButton,
    InputLabel,
    TextField,
    Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { DynamicSelect } from "../../components/DynamicSelect";

const AddUserModal = () => {
    const [formData, setFormData] = useState({
        firstName: null,
        lastName: null,
        email: null,
        username: null,
        password: null,
        university: null,
        role: 1,
    });

    const [universities, roles] = useLoaderData();

    const roleOptions = useMemo(() => {
        const options = {};
        roles.forEach(({ RoleID, RoleName }) => {
            options[RoleID] = RoleName;
        });
        console.log(options);
        return options;
    }, [roles]);

    /**
     * Updates formData state
     * @param {Event} param0 onChange events
     */
    const handleFormChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    const navigate = useNavigate();
    const closeModal = () => navigate("..");

    return (
        <Dialog open onClose={closeModal}>
            <Box
                sx={{
                    width: "25em",
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h6">Add User</Typography>
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    name="firstName"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    name="lastName"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    fullWidth
                    label="E-Mail"
                    value={formData.email}
                    name="email"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    name="username"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    fullWidth
                    label="Password"
                    value={formData.password}
                    name="password"
                    variant="outlined"
                    type="password"
                    onChange={handleFormChange}
                />

                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <DynamicSelect
                        fullWidth
                        label="Role"
                        options={roleOptions}
                        value={formData.role}
                        onChange={({ target }) => {
                            setFormData({ ...formData, role: target.value });
                        }}
                    />
                </FormControl>

                <Autocomplete
                    options={universities}
                    getOptionLabel={(option) => option.universityName}
                    getOptionKey={(option) => option.id}
                    name="university"
                    onChange={handleFormChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="University"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

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
