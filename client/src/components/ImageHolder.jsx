import { Box } from "@mui/material";
import PropTypes from "prop-types";

const ImageHolder = ({ src, ...props }) => {
  return (
    <Box {...props}>
      <img src={src} width="100%" height="100%" />
    </Box>
  );
};
ImageHolder.propTypes = {
  ...Box.propTypes,
  src: PropTypes.string.isRequired,
};

export { ImageHolder };
