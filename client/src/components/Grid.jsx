import { Box } from "@mui/material";
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    QuickFilterModule,
    provideGlobalGridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import PropTypes from "prop-types";

ModuleRegistry.registerModules([ClientSideRowModelModule, QuickFilterModule]);
provideGlobalGridOptions({ theme: "legacy" });

const Grid = ({ boxProps = {}, ...props }) => {
    const mergedStyles = {
        height: "50vh",
        width: "100%",
        ...(boxProps?.sx ?? {}),
    };

    return (
        <Box className="ag-theme-alpine" {...boxProps} sx={mergedStyles}>
            <AgGridReact {...props} />
        </Box>
    );
};

Grid.propTypes = {
    boxProps: PropTypes.objectOf(PropTypes.any),
    ...PropTypes.objectOf(PropTypes.any),
};

export { Grid };
