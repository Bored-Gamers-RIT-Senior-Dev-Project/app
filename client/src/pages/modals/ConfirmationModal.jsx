import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import propTypes from "../../utils/propTypes";
const ConfirmationModal = ({ text = "Are You Sure?", onClose, onConfirm }) => {
    return (
        <Dialog open onClose={onClose}>
            <Box
                sx={{
                    width: "25em",
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
                <Typography variant="h4" textAlign="center">
                    {text}
                </Typography>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button variant="contained" onClick={() => onConfirm()}>
                        Yes
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        No
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

//Surprisingly, this one was NOT made with copilot lol
ConfirmationModal.propTypes = {
    text: propTypes.string,
    onClose: propTypes.func.isRequired,
    onConfirm: propTypes.func.isRequired,
};

export { ConfirmationModal };
