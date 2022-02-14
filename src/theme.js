import { grey, green } from "@mui/material/colors";
import { createTheme } from "@mui/system";

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: "#f44336",
    },
  },
});

theme.props = {
  MuiInputLabel: {},
};

theme.overrides = {
  MuiInput: {
    root: {
      border: `${[grey]}`,
    },
  },
};

export default theme;
