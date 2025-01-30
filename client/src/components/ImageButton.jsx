import { Box, ButtonBase, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ImageButton = ({ src, text, onClick, borderRadius = "4px" }) => {
  return (
    <ButtonBase
      onClick={onClick}
      focusRipple
      sx={{
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={src}
        alt={text}
        sx={{
          width: "100%",
          height: "100%",
          transition: "filter 0.3s ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
      </Box>
    </ButtonBase>
  );
};
ImageButton.propTypes = {
  src: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  borderRadius: PropTypes.string,
};

export { ImageButton };
