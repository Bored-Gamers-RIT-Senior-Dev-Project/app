import { Close as CloseIcon } from "@mui/icons-material";
import {
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
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import { DynamicSelect } from "../../components/DynamicSelect";
import { UniversitySelect } from "../../components/UniversitySelect";

const UserModal = ({
    label,
    onSubmit,
    defaults,
    onClose,
    passwordRequired = false,
}) => {
    const [formData, setFormData] = useState(defaults);

    const [errors, setErrors] = useState({
        firstName: null,
        lastName: null,
        email: null,
        username: null,
        password: null,
        universityId: null,
        roleId: null,
    });

    const [universities, roles] = useLoaderData();
    const actionData = useActionData();

    const roleOptions = useMemo(() => {
        const options = {};
        roles.forEach(({ RoleID, RoleName }) => {
            options[RoleID] = RoleName;
        });
        return options;
    }, [roles]);

    /**
     * Updates formData state
     * @param {Event} param0 onChange events
     */
    const handleFormChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    /**
     * Validates the form's inputs & submits the form to React ROuter
     */
    const handleSubmit = () => {
        let pass = true;
        const newErrors = {
            firstName: null,
            lastName: null,
            email: null,
            username: null,
            password: null,
            universityId: null,
            roleId: null,
        };

        //Form validation courtesy of copilot

        if (!formData.firstName) {
            newErrors.firstName = "First name is required";
            pass = false;
        }

        if (!formData.lastName) {
            newErrors.lastName = "Last name is required";
            pass = false;
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
            pass = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
            pass = false;
        }

        if (!formData.username) {
            newErrors.username = "Username is required";
            pass = false;
        }

        if (!formData.password && passwordRequired) {
            newErrors.password = "Password is required";
            pass = false;
        } else if (
            formData.password.length > 0 &&
            formData.password.length < 6
        ) {
            newErrors.password = "Password must be at least 6 characters";
            pass = false;
        }

        if (!formData.roleId) {
            newErrors.roleId = "Role is required";
            pass = false;
        }

        const selectedRole = roles.find(
            (role) => `${role.RoleID}` == formData.roleId
        );

        if (
            selectedRole.RoleName.includes("University") &&
            !formData.universityId
        ) {
            newErrors.universityId =
                "Assigned University is required for University Personnel";
            pass = false;
        }

        setErrors(newErrors);

        if (pass) {
            onSubmit(formData);
        }
    };

    useEffect(() => {
        if (actionData) {
            onClose();
        }
    });

    return (
        <Dialog open onClose={onClose}>
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
                    <Typography variant="h6">{label} User</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    error={errors.firstName}
                    helperText={errors.firstName}
                    fullWidth
                    required
                    label="First Name"
                    value={formData.firstName}
                    name="firstName"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    error={errors.lastName}
                    helperText={errors.lastName}
                    required
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    name="lastName"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    error={errors.email}
                    helperText={errors.email}
                    required
                    fullWidth
                    label="E-Mail"
                    value={formData.email}
                    name="email"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    error={errors.username}
                    helperText={errors.username}
                    required
                    fullWidth
                    label="Username"
                    value={formData.username}
                    name="username"
                    variant="outlined"
                    onChange={handleFormChange}
                />

                <TextField
                    error={errors.password}
                    helperText={errors.password}
                    required={passwordRequired}
                    fullWidth
                    label="Password"
                    value={formData.password}
                    name="password"
                    variant="outlined"
                    type="password"
                    onChange={handleFormChange}
                />

                <FormControl
                    fullWidth
                    error={errors.roleId}
                    helperText={errors.roleId}
                >
                    <InputLabel>Role</InputLabel>
                    <DynamicSelect
                        error={errors.roleId}
                        helperText={errors.roleId}
                        fullWidth
                        label="Role"
                        options={roleOptions}
                        value={formData.roleId}
                        onChange={({ target }) => {
                            setFormData({ ...formData, roleId: target.value });
                        }}
                    />
                </FormControl>

                <UniversitySelect
                    onEmptied={() =>
                        setFormData({ ...formData, universityId: null })
                    }
                    universities={universities}
                    onChange={(_, newValue) =>
                        newValue &&
                        setFormData({ ...formData, universityId: newValue.id })
                    }
                    error={errors.universityId}
                    helperText={errors.universityId}
                />

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: "8px", padding: "10px" }}
                    onClick={handleSubmit}
                >
                    {label}
                </Button>
            </Box>
        </Dialog>
    );
};

//As usual, propTypes courtesy of Copilot
UserModal.propTypes = {
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    defaults: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    passwordRequired: PropTypes.bool,
};

export { UserModal };
