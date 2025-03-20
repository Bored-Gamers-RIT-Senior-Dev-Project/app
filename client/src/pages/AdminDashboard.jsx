import { useState, useCallback, useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// JDOC Was done with the help of my friend  
/**
 * Sample admin items data.
 * @typedef {Object} AdminItem
 * @property {string} title - The title of the admin item.
 * @property {string} details - Additional details about the item.
 * @property {string} submitted - Submission date (YYYY-MM-DD format).
 * @property {string} lastUpdated - Last updated date (YYYY-MM-DD format).
 * @property {string} status - Current status of the item.
 * @property {string} buttonText - Text to display on the button.
 */
const adminItems = [
    {
        title: "Team Page Edited",
        details: "Team Name: The Best",
        submitted: "2025-02-10",
        lastUpdated: "2025-02-15",
        status: "New",
        buttonText: "REVIEW CHANGES",
    },
    {
        title: "Reported User",
        details: "User Name: badGuy123",
        submitted: "2025-02-12",
        lastUpdated: "2025-02-14",
        status: "New",
        buttonText: "REVIEW REPORT",
    },
    {
        title: "Support Ticket",
        details: "Subject: Can't find my friend!",
        submitted: "2025-02-15",
        lastUpdated: "2025-02-16",
        status: "In Review",
        buttonText: "REVIEW TICKET",
    },
    {
        title: "Support Ticket",
        details: "Subject: Can't find my friend!",
        submitted: "2025-02-18",
        lastUpdated: "2025-02-16",
        status: "In Review",
        buttonText: "REVIEW TICKET",
    },
];

/**
 * Component for displaying an admin item card.
 * @param {AdminItem} props - Admin item properties.
 */
const AdminItemCard = ({ title, details, submitted, lastUpdated, status, buttonText }) => (
    <Card sx={{ mb: 2, p: 2, backgroundColor: "#f0f0f0", boxShadow: 2, borderRadius: "12px" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body1">{details}</Typography>
                <Typography variant="body2">Submitted: {submitted}</Typography>
            </Box>
            <Box textAlign="right">
                <Typography variant="body2" color="textSecondary">
                    Last Updated: {lastUpdated}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Status: {status}
                </Typography>
                <Button variant="contained" sx={{ mt: 1, borderRadius: "8px" }}>
                    {buttonText}
                </Button>
            </Box>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState("All");

    /**
     * Handles the search input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
     */
    const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);

    /**
     * Handles the ticket type selection change.
     * @param {React.ChangeEvent<{ value: unknown }>} e - The event object.
     */
    const handleTicketTypeChange = useCallback((e) => setTicketType(e.target.value), []);

    /**
     * Filters admin items based on search, date range, and ticket type.
     * @returns {AdminItem[]} The filtered list of admin items.
     */
    const getFilteredItems = useCallback(() => {
        return adminItems.filter((item) => {
            const submittedDate = dayjs(item.submitted);
            const isWithinDateRange =
                (!startDate || submittedDate.isAfter(startDate) || submittedDate.isSame(startDate)) &&
                (!endDate || submittedDate.isBefore(endDate) || submittedDate.isSame(endDate));

            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.details.toLowerCase().includes(search.toLowerCase());

            const matchesType = ticketType === "All" || item.title.includes(ticketType);
            return isWithinDateRange && matchesSearch && matchesType;
        });
    }, [search, ticketType, startDate, endDate]);

    const filteredItems = useMemo(() => getFilteredItems(), [getFilteredItems]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box p={3} sx={{ maxWidth: "900px", margin: "auto" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Admin Dashboard
                </Typography>

                <Box
                    display="flex"
                    gap={2}
                    mb={3}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "10px",
                        borderRadius: "8px",
                        flexWrap: "nowrap",
                    }}
                >
                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel>Ticket Type</InputLabel>
                        <Select value={ticketType} onChange={handleTicketTypeChange}>
                            <MenuItem value="All">All Types</MenuItem>
                            <MenuItem value="Team Page">Team Page</MenuItem>
                            <MenuItem value="Reported User">Report User</MenuItem>
                            <MenuItem value="Support Ticket">Support Ticket</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Search"
                        value={search}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 200 }}
                    />
                </Box>

                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => <AdminItemCard key={index} {...item} />)
                ) : (
                    <Typography textAlign="center" color="textSecondary">
                        No matching tickets found.
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export { AdminDashboard };
