import { Box } from "@mui/material";
import PropTypes from "prop-types";

const ImageHolder = ({ src, alt, sx = {}, ...props }) => {
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            {...props}
            sx={{
                overflow: "hidden",
                maxWidth: "100%",
                height: "fit-content",
                ...sx,
            }}
        />
    );
};
ImageHolder.propTypes = {
    ...Box.propTypes,
    src: PropTypes.string.isRequired,
};

export { ImageHolder };
