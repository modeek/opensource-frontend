import React from 'react';
import {
	Button,
	Typography,
	Grid,
	Card,
	Box,
	Paper,
	IconButton,
} from '@material-ui/core';

import { inject, observer } from 'mobx-react';
import { NextPage } from 'next';
import {
	NavigateBefore,
	Add,
	AddOutlined,
	AddBox,
	ShoppingCart,
	CreditCard,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../src/constants/Layout';
import Link from '../src/components/Link';

const useStyles = makeStyles((theme) => ({
	textAlign: {
		textAlign: 'left',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
		},
	},

	itemGrid: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));
const index: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;
		console.log(props);

		const classes = useStyles();

		return (
			<Layout>
				<Grid
					container
					spacing={3}
					style={{
						marginTop: 12,
					}}
				>
					<Grid item xs={12} md={6}>
						<Card
							style={{
								height: '100%',
							}}
						>
							<Box
								p={2}
								style={{
									height: '100%',
								}}
							>
								<Grid
									container
									spacing={1}
									style={{
										display: 'flex',
										height: '100%',
									}}
								>
									<Grid item xs={12}>
										{store.address && store.address.formatted_address && (
											<Typography
												variant="overline"
												style={{
													lineHeight: 1,
													fontSize: 14,
												}}
											>
												Drop Off Address:
											</Typography>
										)}
									</Grid>
									<Grid item xs={12}>
										{store.address && store.address && (
											<Typography
												variant="button"
												style={{
													lineHeight: 1,
													fontSize: 18,
												}}
											>
												{`${store.address}`}
											</Typography>
										)}
									</Grid>

									<Grid
										item
										xs={12}
										style={{
											alignSelf: 'flex-end',
											paddingBottom: 0,
										}}
									>
										<Button
											variant="contained"
											color="primary"
											size="large"
											fullWidth
											startIcon={<NavigateBefore />}
										>
											<Link
												href="/"
												color="inherit"
												style={{
													width: '100%',
												}}
											>
												Change Drop Off Address
											</Link>
										</Button>
									</Grid>
								</Grid>
							</Box>
						</Card>
					</Grid>

					<Grid item xs={12} md={6}>
						<Card
							style={{
								height: '100%',
							}}
						>
							<Box
								p={2}
								style={{
									height: '100%',
								}}
							>
								<Grid
									container
									spacing={1}
									style={{
										display: 'flex',
										height: '100%',
									}}
								>
									<Grid item xs={12}>
										{store.address && store.address.formatted_address && (
											<Typography
												variant="overline"
												style={{
													lineHeight: 1,
													fontSize: 14,
												}}
											>
												Estimated Drop Off Time:
											</Typography>
										)}
									</Grid>
									<Grid item xs={12}>
										{store.address && store.address.formatted_address && (
											<Typography
												variant="button"
												style={{
													lineHeight: 1,
													fontSize: 20,
												}}
											>
												{`Today @ ${new Date(
													new Date().getTime() + 1000 * 60 * 45
												).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: 'numeric',
												})} (45 Minutes)`}
											</Typography>
										)}
									</Grid>

									<Grid
										item
										xs={12}
										style={{
											alignSelf: 'flex-end',
											paddingBottom: 0,
										}}
									>
										{store.address && store.address.formatted_address && (
											<Typography
												variant="subtitle1"
												style={{
													lineHeight: 1.2,
													fontSize: 13,
												}}
											>
												*Please allow for 15 minutes of cushion as we can't
												calculate for any unexpected events that may happen.
												Order may also arrive earlier than the estimated time.
											</Typography>
										)}
									</Grid>
								</Grid>
							</Box>
						</Card>
					</Grid>

					{/* Create List of Items */}

					<Grid item xs={12}>
						<Card>
							<Box p={2}>First Hookah</Box>
						</Card>
					</Grid>

					{/* Create List of Items */}

					<Grid xs={12}>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							endIcon={<CreditCard />}
						>
							Continue to Payment
						</Button>
					</Grid>
				</Grid>
			</Layout>
		);
	})
);

export default index;
