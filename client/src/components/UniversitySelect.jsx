import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
const UniversitySelect = ({
    universities,
    onChange,
    onEmptied,
    error,
    helperText,
    label = "University",
    name = label.toLowerCase(),
}) => {
    return (
        <Autocomplete
            onEmptied={onEmptied}
            options={universities}
            getOptionLabel={(option) => option.universityName}
            getOptionKey={(option) => option.id}
            name={name}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={error}
                    helperText={helperText}
                    label={label}
                    variant="outlined"
                    fullWidth
                />
            )}
        />
    );
};

UniversitySelect.propTypes = {
    onEmptied: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    universities: PropTypes.array.isRequired,
    error: PropTypes.string,
    helperText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
};

export { UniversitySelect };
