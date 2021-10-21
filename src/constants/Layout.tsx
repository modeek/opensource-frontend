import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { useRouter } from 'next/router';
import {
	// SvgIcon,
	Button,
	Collapse,
	Box,
	ButtonBase,
	Divider,
	ClickAwayListener,
	useMediaQuery,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Logo from './LogoSVG.svg';

function Copyright() {
	return (
		<Typography
			variant="body2"
			color="textSecondary"
			align="center"
			style={{ marginTop: 30 }}
		>
			{'Copyright © '}
			<Link color="inherit" href="https://sheesha.app">
				Sheesha
			</Link>{' '}
			{new Date().getFullYear()}.
		</Typography>
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},

	content: {
		flexGrow: 1,
		flex: 1,
		overflow: 'auto',
	},

	container: {
		// paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
}));

const navButtons = [
	{
		name: 'Products',
		subs: [
			{ name: 'Suits' },
			{
				name: 'Dress Shirts',
			},
		],
	},
	{
		name: 'About',
		subs: [{ name: 'Suits' }],
	},
];

function Layout(props: any) {
	const router = useRouter();
	const classes = useStyles();

	const [expanded, setExpanded] = React.useState<any>({});

	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('sm')
	);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<main className={classes.content}>
				<Container maxWidth="xl" className={classes.container}>
					<div
						style={{
							padding: 20,
							paddingLeft: (isSmallScreen && 10) || 20,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<a
							style={{
								flexDirection: 'row',
								display: 'flex',
								alignItems: 'center',
								textDecoration: 'none',
								color: 'black',
							}}
							href="/"
						>
							<Logo height={50} width={50} />
							<Typography
								variant="h6"
								align="center"
								style={{
									fontFamily: 'Yatra One',
									alignSelf: 'flex-end',
									height: '100%',
									paddingBottom: 5,
								}}
							>
								Sheesha
							</Typography>
						</a>
					</div>
					{props.children}
				</Container>
				{/* {Copyright()} */}
			</main>
		</div>
	);
}

Layout.getInitialProps = (e: any) => {
	console.log('yuh', e);
};

export default Layout;
