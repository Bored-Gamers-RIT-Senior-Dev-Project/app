import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import PropTypes from "../utils/propTypes";

const ModalContent = ({ open, onClose, modalType }) => {
    if (!modalType) return null;

    const fields =
        modalType === "User"
            ? [
                  { label: "E-Mail" },
                  { label: "Username" },
                  { label: "University" },
              ]
            : [
                  { label: "Name" },
                  { label: "Location" },
                  { label: "Rep E-Mail" },
              ];

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    width: 400,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6">Add {modalType}</Typography>
                    <IconButton onClick={onClose}>
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
                {modalType === "User" && (
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
                )}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: "8px", padding: "10px" }}
                >
                    Add
                </Button>
            </Box>
        </Modal>
    );
};

const UserManager = () => {
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalType, setModalType] = useState(null);

    const rowData = useLoaderData();

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleOpenModal = (type) => {
        setModalType(type);
        handleMenuClose();
    };
    const handleCloseModal = () => setModalType(null);

    const columnTypes = {
        date: {
            valueGetter: ({ data }) => (data ? new Date(data.createdAt) : null),
            valueFormatter: ({ value }) => new Date(value).toLocaleString(),
            filter: "agDateColumnFilter",
        },
    };

    const columnDefs = [
        {
            headerName: "ID",
            field: "userId",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Username",
            field: "username",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            headerName: "E-Mail",
            field: "email",
            flex: 1.5,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Created On",
            field: "createdAt",
            flex: 1,
            sortable: true,
            type: "date",
        },
        {
            headerName: "University",
            field: "universityName",
            flex: 1.5,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Team Name",
            field: "teamName",
            flex: 1,
            sortable: true,
            filter: "agSetColumnFilter",
        },
        {
            headerName: "Role",
            field: "roleName",
            flex: 1,
            sortable: true,
            filter: "agSetColumnFilter",
        },
    ];

    return (
        <Paper
            sx={{
                width: "100%",
                height: "80%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1em",
            }}
        >
            <Typography variant="h4" mb={2} textAlign="center">
                User Manager
            </Typography>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                width="100%"
            >
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ width: "300px" }}
                />
                <Button
                    variant="contained"
                    onClick={handleMenuOpen}
                    sx={{ minWidth: "150px" }}
                >
                    Add
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleOpenModal("User")}>
                        New User
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenModal("University")}>
                        New University
                    </MenuItem>
                </Menu>
            </Box>
            <Box
                className="ag-theme-alpine"
                style={{ width: "1200px", height: "100%" }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    columnTypes={columnTypes}
                    pagination
                />
            </Box>
            <ModalContent
                open={!!modalType}
                onClose={handleCloseModal}
                modalType={modalType}
            />
        </Paper>
    );
};

//Proptypes generated via copilot
ModalContent.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    modalType: PropTypes.string,
};

export { UserManager };
