import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Menu,
    MenuItem,
    Modal,
    IconButton,
    Select,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Search as SearchIcon, MoreVert as MoreVertIcon, Close as CloseIcon } from "@mui/icons-material";

const UserManager = () => {
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalType, setModalType] = useState(null);

    const rowData = [
        { username: "User1", email: "user1@example.com", createdOn: "2025-02-15", university: "XYZ University", team: "Team A", role: "Admin" },
        { username: "User2", email: "user2@example.com", createdOn: "2025-02-14", university: "ABC University", team: "Team B", role: "Participant" },
    ];

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleOpenModal = (type) => { setModalType(type); handleMenuClose(); };
    const handleCloseModal = () => setModalType(null);

    const columnDefs = [
        { headerName: "Username", field: "username", flex: 1, sortable: true, filter: true },
        { headerName: "E-Mail", field: "email", flex: 1.5, sortable: true, filter: true },
        { headerName: "Created On", field: "createdOn", flex: 1, sortable: true, filter: true },
        { headerName: "University", field: "university", flex: 1.5, sortable: true, filter: true },
        { headerName: "Team", field: "team", flex: 1, sortable: true, filter: true },
        { headerName: "Role", field: "role", flex: 1, sortable: true, filter: true },
    ];

    const renderModalContent = () => {
        if (!modalType) return null;

        const fields = modalType === "User" ? [
            { label: "E-Mail" }, { label: "Username" }, { label: "University" }
        ] : [
            { label: "Name" }, { label: "Location" }, { label: "Rep E-Mail" }
        ];

        return (
            <Modal open onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", borderRadius: 2, boxShadow: 24, p: 3, width: 400 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Add {modalType}</Typography>
                        <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
                    </Box>
                    {fields.map(({ label }, index) => (
                        <TextField key={index} fullWidth label={label} variant="outlined" sx={{ mb: 2 }} />
                    ))}
                    {modalType === "User" && (
                        <Select fullWidth displayEmpty variant="outlined" sx={{ mb: 3 }}>
                            <MenuItem value="" disabled>Select Role</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Participant">Participant</MenuItem>
                        </Select>
                    )}
                    <Button variant="contained" fullWidth sx={{ borderRadius: "8px", padding: "10px" }}>Add</Button>
                </Box>
            </Modal>
        );
    };

    return (
        <Box p={3} display="flex" flexDirection="column" alignItems="center" height="90vh">
            <Typography variant="h4" mb={2} textAlign="center">User Manager</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} width="100%" maxWidth="1200px">
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: "300px" }}
                />
                <Button variant="contained" onClick={handleMenuOpen} sx={{ minWidth: "150px" }}>Add</Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleOpenModal("User")}>New User</MenuItem>
                    <MenuItem onClick={() => handleOpenModal("University")}>New University</MenuItem>
                </Menu>
            </Box>
            <Box className="ag-theme-alpine" style={{ height: "75vh", width: "80vw", maxWidth: "1200px" }}>
                <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination domLayout="autoHeight" autoSizeStrategy={{ type: "fitGridWidth" }} suppressDragLeaveHidesColumns />
            </Box>
            {renderModalContent()}
        </Box>
    );
};

export { UserManager };