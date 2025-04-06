import { createTheme, responsiveFontSizes } from "@mui/material";

//Colors taken from Sponsor Document
const Colors = {
    aardvark: {
        main: "#13505B",
        secondary: "#119DA4",
    },
    game: {
        darkGreen: "#008001",
        lightGreen: "#9EF01A",
        blue: "#0763a6",
        salmon: "#F47A60",
        tan: "#edca82",
        purple: "#8A307F",
    },
};

const palette = {
    primary: {
        main: Colors.game.blue,
    },
    secondary: {
        main: Colors.game.purple,
    },
    success: {
        main: Colors.game.darkGreen,
    },
};

const theme = responsiveFontSizes(createTheme({ palette }));

const pageWidth = {
    xs: "90vw",
    md: "800px",
};

export { Colors, pageWidth, theme };
