import SearchIcon from "@mui/icons-material/Search";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputAdornment,
    InputLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { DynamicSelect } from "../components/DynamicSelect";
import PropTypes from "../utils/propTypes";
// JDOC Was done with the help of my friend @sp5442@g.rit.edu

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

const getTicketDate = (ticket) => {
    switch (ticket.type) {
        case "newUser":
        case "newTeam":
            return dayjs(ticket.CreatedAt);
        case "teamEdit":
        case "userEdit":
            return dayjs(ticket.RequestedDate);
    }
};

const searchTicket = (ticket, searchTerm) => {
    searchTerm = searchTerm.toLowerCase();
    switch (ticket.type) {
        case "newUser":
        case "userEdit":
            return (
                ticket.FirstName?.toLowerCase().includes(searchTerm) ||
                ticket.LastName?.toLowerCase().includes(searchTerm) ||
                ticket.Username?.toLowerCase().includes(searchTerm) ||
                ticket.Email?.toLowerCase().includes(searchTerm)
            );
        case "newTeam":
        case "teamEdit":
            return (ticket.TeamName ?? "").toLowerCase().includes(searchTerm);
    }
};

/**
 * Component for displaying an admin item card.
 * @param {AdminItem} props - Admin item properties.
 */
const AdminItemCard = ({ ticket }) => {
    let cardContent;
    switch (ticket.type) {
        case "newUser":
            cardContent = <NewUserCard newUser={ticket} />;
            break;
        case "newTeam":
            cardContent = <NewTeamCard newTeam={ticket} />;
            break;
        case "teamEdit":
            cardContent = <TeamEditCard teamEdit={ticket} />;
            break;
        case "userEdit":
            cardContent = <UserEditCard userEdit={ticket} />;
            break;
    }

    return (
        <Card
            sx={{
                p: 1,
                boxShadow: 2,
                borderRadius: "12px",
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {cardContent}
            </CardContent>
            <CardActions
                sx={{ display: "flex", flexDirection: "row-reverse", gap: 1 }}
            >
                <Button variant="contained">Approve</Button>
                <Button variant="contained" color="secondary">
                    Deny
                </Button>
            </CardActions>
        </Card>
    );
};

const NewUserCard = ({ newUser }) => {
    return (
        <Box width="100%">
            <Typography variant="h4" sx={{ mb: 1 }}>
                New User
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    padding: 1,
                }}
            >
                <Avatar
                    sx={{ width: "5em", height: "5em", mr: 2 }}
                    alt={`${newUser.FirstName} ${newUser.LastName}`}
                    src={newUser.ProfileImageURL}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                        {newUser.FirstName} {newUser.LastName}
                    </Typography>
                    <Typography variant="body2">
                        Email: {newUser.Email}
                    </Typography>
                    <Typography variant="body2">
                        Username: {newUser.Username}
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={(theme) => ({
                        fontStyle: "italic",
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.grey[400]}`,
                        flexGrow: 3,
                        height: "100%",
                        display: "block",
                    })}
                >
                    {newUser.Bio ?? "No Bio"}
                </Typography>
            </Paper>
        </Box>
    );
};
NewUserCard.propTypes = {
    newUser: PropTypes.object.isRequired,
};

const NewTeamCard = ({ newTeam }) => {
    console.log(newTeam);
    return (
        <Box width="100%">
            <Typography variant="h4" sx={{ mb: 1 }}>
                New Team
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    padding: 1,
                }}
            >
                <Avatar
                    sx={{ width: "5em", height: "5em", mr: 2 }}
                    alt={`${newTeam.TeamName}`}
                    src={newTeam.ProfileImageURL}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{newTeam.TeamName}</Typography>
                    <Typography variant="body2">
                        {/* Email: {userEdit.Email} */}
                    </Typography>
                    <Typography variant="body2">
                        {/* Username: {userEdit.Username} */}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};
NewTeamCard.propTypes = {
    newTeam: PropTypes.object.isRequired,
};

const UserEditCard = ({ userEdit }) => {
    return (
        <Box width="100%">
            <Typography variant="h4" sx={{ mb: 1 }}>
                Edited User
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    padding: 1,
                }}
            >
                <Avatar
                    sx={{ width: "5em", height: "5em", mr: 2 }}
                    alt={`${userEdit.FirstName} ${userEdit.LastName}`}
                    src={userEdit.ProfileImageURL}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                        {userEdit.FirstName} {userEdit.LastName}
                    </Typography>
                    <Typography variant="body2">
                        Email: {userEdit.Email}
                    </Typography>
                    <Typography variant="body2">
                        Username: {userEdit.Username}
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={(theme) => ({
                        fontStyle: "italic",
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.grey[400]}`,
                        flexGrow: 3,
                        height: "100%",
                        display: "block",
                    })}
                >
                    {userEdit.Bio ?? "No Bio"}
                </Typography>
            </Paper>
            <Button variant="contained" color="secondary">
                Deny
            </Button>
            <Button variant="contained">Approve</Button>
        </Box>
    );
};
UserEditCard.propTypes = {
    userEdit: PropTypes.object.isRequired,
};

const TeamEditCard = ({ teamEdit }) => {
    return (
        <Box width="100%">
            <Typography variant="h4" sx={{ mb: 1 }}>
                Team Update
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    padding: 1,
                }}
            >
                <Avatar
                    sx={{ width: "5em", height: "5em", mr: 2 }}
                    alt={`${teamEdit.TeamName}`}
                    src={teamEdit.ProfileImageURL}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{teamEdit.TeamName}</Typography>
                    <Typography variant="body2">
                        {/* Email: {userEdit.Email} */}
                    </Typography>
                    <Typography variant="body2">
                        {/* Username: {userEdit.Username} */}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};
TeamEditCard.propTypes = {
    teamEdit: PropTypes.object.isRequired,
};

const UniversityDashboard = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState("All");

    const tickets = useLoaderData();
    /**
     * Handles the search input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
     */
    const handleSearchChange = useCallback(
        (e) => setSearch(e.target.value),
        []
    );

    /**
     * Handles the ticket type selection change.
     * @param {React.ChangeEvent<{ value: unknown }>} e - The event object.
     */
    const handleTicketTypeChange = useCallback(
        (e) => setTicketType(e.target.value),
        []
    );

    /**
     * Filters admin items based on search, date range, and ticket type.
     * @returns {AdminItem[]} The filtered list of admin items.
     */
    const getFilteredItems = useCallback(() => {
        return tickets.filter((item) => {
            const submittedDate = getTicketDate(item);
            const isWithinDateRange =
                (!startDate ||
                    submittedDate.isAfter(startDate) ||
                    submittedDate.isSame(startDate)) &&
                (!endDate ||
                    submittedDate.isBefore(endDate) ||
                    submittedDate.isSame(endDate));

            const matchesSearch = searchTicket(item, search);

            const matchesType = ticketType === "All" || item.type == ticketType;
            return isWithinDateRange && matchesSearch && matchesType;
        });
    }, [tickets, search, ticketType, startDate, endDate]);

    const filteredItems = useMemo(() => getFilteredItems(), [getFilteredItems]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                p={3}
                sx={{
                    maxWidth: "900px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    Admin Dashboard
                </Typography>

                <Paper
                    display="flex"
                    gap={2}
                    mb={3}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        flexWrap: "nowrap",
                    }}
                >
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                    />
                    <FormControl>
                        <InputLabel htmlFor="ticketType" id="ticketTypeLabel">
                            Sort By
                        </InputLabel>
                        <DynamicSelect
                            value={ticketType}
                            onChange={(event) =>
                                setTicketType(event.target.value)
                            }
                            id="ticketType"
                            label="Ticket Type"
                            options={{
                                All: "All Types",
                                newUser: "New User",
                                userEdit: "Edited User",
                                newTeam: "New Team",
                                teamEdit: "Edited Team",
                            }}
                        />
                    </FormControl>
                    <TextField
                        label="Search"
                        value={search}
                        onChange={handleSearchChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: 200 }}
                    />
                </Paper>

                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <AdminItemCard key={index} ticket={item} />
                    ))
                ) : (
                    <Typography textAlign="center" color="textSecondary">
                        No matching tickets found.
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};

//Proptypes generated by copilot
AdminItemCard.propTypes = {
    title: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    submitted: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
};

export { UniversityDashboard };
