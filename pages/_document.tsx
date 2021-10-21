import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../src/theme';

const env = process.env.NODE_ENV;
const dev = env !== 'production';

// let csp = ``;
// csp += `base-uri 'self' sheesha.app *.sheesha.app vitals.vercel-insights.com 5rt9fhw2qb.execute-api.us-east-1.amazonaws.com;`;
// csp += `form-action 'self';`;
// csp += `default-src 'self' sheesha.app *.sheesha.app vitals.vercel-insights.com 5rt9fhw2qb.execute-api.us-east-1.amazonaws.com;`;
// csp += `script-src 'self' https://js.stripe.com ${dev ? "'unsafe-eval'" : ''};`; // NextJS requires 'unsafe-eval' in dev (faster source maps)
// csp += `style-src 'self' https://fonts.googleapis.com 'unsafe-inline' data:;`; // NextJS requires 'unsafe-inline'
// csp += `img-src 'self' https://*.sheesha.com data: blob:;`;
// csp += `font-src 'self' https://fonts.gstatic.com;`; // TODO
// csp += `frame-src https://js.stripe.com https://hooks.stripe.com;`; // TODO
// csp += `media-src *;`; // TODO
// csp += `connect-src https://api.stripe.com *.sheesha.app vitals.vercel-insights.com 5rt9fhw2qb.execute-api.us-east-1.amazonaws.com;`; // TODO

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap"
					/>

					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Yatra+One:300,400,500,600,700&display=swap"
					/>
					{/* 
					<meta httpEquiv="Content-Security-Policy" content={csp} /> */}

					<meta name="application-name" content="Sheesha" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content="Sheesha" />
					<meta
						name="description"
						content="Sheesha PWA to purchase Sheesha on the go"
					/>
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta
						name="msapplication-config"
						content="/icons/browserconfig.xml"
					/>
					<meta name="msapplication-TileColor" content="#2B5797" />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta name="theme-color" content="#000000" />

					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/icons/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/icons/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/icons/favicon-16x16.png"
					/>
					<link rel="manifest" href="/manifest.json" />
					<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" />
					<link rel="shortcut icon" href="/icons/favicon.ico" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
					/>

					<meta name="twitter:card" content="summary" />
					<meta name="twitter:url" content="https://sheesha.app" />
					<meta name="twitter:title" content="Sheesha" />
					<meta
						name="twitter:description"
						content="Sheesha PWA to purchase Sheesha on the go"
					/>
					<meta
						name="twitter:image"
						content="https://sheesha.app/icons/android-chrome-192x192.png"
					/>
					<meta name="twitter:creator" content="@Modeek_" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="Sheesha" />
					<meta
						property="og:description"
						content="Sheesha PWA to purchase Sheesha on the go"
					/>
					<meta property="og:site_name" content="Sheesha" />
					<meta property="og:url" content="https://sheesha.app" />
					<meta
						property="og:image"
						content="https://sheesha.app/icons/apple-touch-icon.png"
					/>
					<script id="stripe-js" src="https://js.stripe.com/v3/" async />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	// Render app and page and get the context of the page with collected side effects.
	const sheets = new ServerStyleSheets();
	const originalRenderPage = ctx.renderPage;

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
		});

	const initialProps = await Document.getInitialProps(ctx);

	return {
		...initialProps,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: [
			...React.Children.toArray(initialProps.styles),
			sheets.getStyleElement(),
		],
	};
};
