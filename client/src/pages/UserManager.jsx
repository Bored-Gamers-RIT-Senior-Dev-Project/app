import { Search as SearchIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";

const UserManager = () => {
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const rowData = useLoaderData();

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

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
                    <MenuItem onClick={() => navigate("./addUser")}>
                        New User
                    </MenuItem>
                    <MenuItem onClick={() => navigate("./addUniversity")}>
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
            <Outlet />
        </Paper>
    );
};

export { UserManager };
