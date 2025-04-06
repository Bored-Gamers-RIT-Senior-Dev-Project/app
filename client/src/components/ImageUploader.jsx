//SO MUCH of this file was autofilled by copilot, checked and modified by me.
import { CloudUpload } from "@mui/icons-material";
import { Button, styled } from "@mui/material";
import PropTypes from "prop-types";

//Taken from MUI docs, this is a hidden input for the file upload button.
// https://mui.com/material-ui/react-button/#file-upload
const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const ImageUploader = ({
    label = "Upload New Image",
    onUpload = (x) => console.log(x),
    ...props
}) => {
    return (
        <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
            {...props}
        >
            {label}
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => onUpload(event.target.files[0])}
                accept="image/*"
            />
        </Button>
    );
};

ImageUploader.propTypes = {
    label: PropTypes.string.isRequired,
    onUpload: PropTypes.func.isRequired,
};
export { ImageUploader };
