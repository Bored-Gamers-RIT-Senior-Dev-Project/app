import { Box, Card, CardContent, Typography } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PropTypes from "prop-types";
import { Grid } from "./Grid";

//Component Layout created by chatGPT https://chatgpt.com/canvas/shared/67e2c89cbeb88191b49c51fc7d74c8f8
const ReportGridTwo = ({ data, totals }) => {
    const columnDefs = [
        {
            headerName: "Next Tournament",
            field: "DateOfNextTournamentPlay",
            sortable: true,
            filter: "agDateColumnFilter",
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString();
            },
        },
        {
            headerName: "College Name",
            field: "CollegeName",
            sortable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Country",
            field: "CollegeCountry",
            sortable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Planned Matches",
            field: "NumberOfMatchesPlanned",
            sortable: true,
            filter: "agNumberColumnFilter",
        },
        {
            headerName: "Matches Played",
            field: "TotalMatchesPlayed",
            sortable: true,
            filter: "agNumberColumnFilter",
        },
        {
            headerName: "Eliminations Complete",
            field: "EliminationsComplete",
            sortable: true,
            filter: "agTextColumnFilter",
        },
    ];

    return (
        <Box>
            <Grid
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={{ flex: 1 }}
                pagination={true}
                paginationPageSize={10}
            />
            <Card variant="outlined" style={{ marginTop: 20 }}>
                {console.log(totals)}
                <CardContent>
                    <Typography variant="h6">Totals</Typography>
                    <Typography>
                        Total Colleges: {totals.TotalColleges}
                    </Typography>
                    <Typography>
                        Total Matches Planned: {totals.TotalMatchesPlanned}
                    </Typography>
                    <Typography>
                        Total Matches Played: {totals.TotalMatchesPlayed}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

//Proptypes built in copilot
ReportGridTwo.propTypes = {
    data: PropTypes.array.isRequired,
    totals: PropTypes.shape({
        TotalColleges: PropTypes.number.isRequired,
        TotalMatchesPlanned: PropTypes.number.isRequired,
        TotalMatchesPlayed: PropTypes.number.isRequired,
    }).isRequired,
};

export { ReportGridTwo };
