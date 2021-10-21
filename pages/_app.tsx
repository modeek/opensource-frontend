import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { Provider } from 'mobx-react';
import { create } from 'mobx-persist';
import { StripeProvider } from 'react-stripe-elements';
import { useStore } from '../src/constants/store';

import '../src/constants/globalCSS.css';
import '../src/constants/verificationCode.css';

import theme from '../src/theme';
import { NoSsr } from '@material-ui/core';

export default function MyApp(props: AppProps) {
	const { Component, pageProps } = props;

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles && jssStyles.parentElement) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	const store = useStore(pageProps.initialState);

	// if (!(typeof window === "undefined")) {
	//   const hydrate = create({
	//     storage: localStorage,
	//     jsonify: true,
	//   });

	//   hydrate("address", store).then(() => {
	//     console.log("hydrated");
	//     console.log(store, "here");
	//   });
	// }
	return (
		<>
			<Head>
				<title>My page</title>
				<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAZgRxUwivhQa667FiBY8jYjsQ12EPbj1A&libraries=places" />
				<script id="stripe-js" src="https://js.stripe.com/v3/" async />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>
			<script src="../src/constants/inobounce.min.js" />
			<script src="https://js.stripe.com/v3/" />
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<NoSsr>
						<Provider store={store}>
							<Component {...pageProps} />
						</Provider>
					</NoSsr>
				</MuiPickersUtilsProvider>
			</ThemeProvider>
		</>
	);
}
