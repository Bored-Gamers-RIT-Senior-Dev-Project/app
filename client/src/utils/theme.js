import { createTheme } from "@mui/material";

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
  background: {
    white: "#FFFFFF",
    black: "#000000",
  },
};

const palette = {
  primary: {
    main: Colors.aardvark.main,
    // contrastText: Colors.white,
  },
  secondary: {
    main: Colors.game.blue,
  },
};

const theme = createTheme({ palette });

export { theme };

