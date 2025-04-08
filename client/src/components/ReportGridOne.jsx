import { Box, Card, CardContent, Typography } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PropTypes from "prop-types";
import { Grid } from "./Grid";

//Component Layout created by chatGPT https://chatgpt.com/canvas/shared/67e2c89cbeb88191b49c51fc7d74c8f8
const ReportGridOne = ({ data, totals }) => {
    const columnDefs = [
        {
            headerName: "Date Added",
            field: "DateAdded",
            sortable: true,
            resizable: true,
            valueGetter: ({ data }) => (data ? new Date(data.DateAdded) : null),
            valueFormatter: ({ value }) => new Date(value).toLocaleString(),
            filter: "agDateColumnFilter",
        },
        {
            headerName: "College Name",
            field: "CollegeName",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            headerName: "Country",
            field: "CollegeCountry",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            headerName: "Teams",
            field: "NumberOfTeams",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            headerName: "Team Members",
            field: "NumberOfTeamMembers",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            headerName: "Moderator Exists",
            field: "CollegeModeratorExists",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            headerName: "Page Created",
            field: "CollegePageCreated",
            filter: true,
            sortable: true,
            resizable: true,
        },
    ];

    return (
        <Box>
            <Grid
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={{ flex: 1 }}
                paginationPageSize={10}
                pagination
            />
            <Card variant="outlined" style={{ marginTop: 20 }}>
                <CardContent>
                    <Typography variant="h6">Totals</Typography>
                    <Typography>
                        Total Colleges: {totals.TotalColleges}
                    </Typography>
                    <Typography>Total Teams: {totals.TotalTeams}</Typography>
                    <Typography>
                        Total Team Members: {totals.TotalTeamMembers}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

//Proptypes built in copilot
ReportGridOne.propTypes = {
    data: PropTypes.array.isRequired,
    totals: PropTypes.shape({
        TotalColleges: PropTypes.number.isRequired,
        TotalTeams: PropTypes.number.isRequired,
        TotalTeamMembers: PropTypes.number.isRequired,
    }).isRequired,
};

export { ReportGridOne };
