import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import { deepOrange } from '@material-ui/core/colors';
// import { lightBlue } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
	typography: {
		fontFamily: 'Poppins',
	},

	palette: {
		primary: {
			main: '#FC510D',
		},
		secondary: {
			main: '#fafafa',
		},
		error: {
			main: red.A400,
		},

		text: {
			primary: '#3B1204',
			secondary: '#272626',
		},

		background: { paper: '#F9F5F2', default: '#ffffff' },

		// type: "dark",

		// contrastThreshold: 3,
		// // Used by the functions below to shift a color's luminance by approximately
		// // two indexes within its tonal palette.
		// // E.g., shift from Red 500 to Red 300 or Red 700.
		// tonalOffset: 0.2,
	},
});

export default theme;
