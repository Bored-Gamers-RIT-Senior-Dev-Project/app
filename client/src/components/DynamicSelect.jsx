import { MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { BrowserView, MobileView } from "react-device-detect";

/**
 * DynamicSelect component transitions to native variant when react-device-detect detects a mobile device
 */
const DynamicSelect = (props) => {
    const { options, ...otherProps } = props;
    return (
        <>
            <BrowserView>
                <Select {...otherProps}>
                    {Object.entries(options).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </BrowserView>
            <MobileView>
                <Select native {...otherProps}>
                    {Object.entries(options).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </Select>
            </MobileView>
        </>
    );
};

DynamicSelect.propTypes = {
    ...Select.propTypes,
    options: PropTypes.objectOf(PropTypes.string).isRequired,
};

export { DynamicSelect };
