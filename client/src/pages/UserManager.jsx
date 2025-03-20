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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

const UserManager = () => {
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalType, setModalType] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleOpenModal = (type) => { setModalType(type); handleMenuClose(); };
    const handleCloseModal = () => setModalType(null);

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>User Manager</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                />
                <Button variant="contained" onClick={handleMenuOpen}>Add</Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleOpenModal("User")}>New User</MenuItem>
                    <MenuItem onClick={() => handleOpenModal("University")}>New University</MenuItem>
                </Menu>
            </Box>

            {/* Modal - Initially inside UserManager.js */}
            <Modal open={!!modalType} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 3, width: 400 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Add {modalType}</Typography>
                        <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
                    </Box>
                    <TextField fullWidth label="Name" variant="outlined" sx={{ mb: 2 }} />
                    <Button variant="contained" fullWidth>Add</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export { UserManager };
