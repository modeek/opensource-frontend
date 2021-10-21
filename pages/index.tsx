import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	ButtonBase,
	Card,
	CircularProgress,
	ClickAwayListener,
	Collapse,
	FormControl,
	Grid,
	InputBase,
	NoSsr,
	Paper,
	Theme,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

import { inject, observer } from 'mobx-react';
import { NextPage } from 'next';
import Confetti from 'react-dom-confetti';

import { ArrowRightAlt, LocationOnOutlined } from '@material-ui/icons';

import Carousel from 'react-material-ui-carousel';
import ReactMapGL from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import usePlacesAutocomplete, { Suggestion } from 'use-places-autocomplete';

import Geocode from 'react-geocode';
import Layout from '../src/constants/Layout';
import HomePhoto from '../src/constants/homePhoto.svg';
import HomePhotoMobile from '../src/constants/homePhotoMobile.svg';
import FreeDelivery from '../src/constants/freeDelivery.svg';
import BoxHearts from '../src/constants/boxHearts.svg';
import Map from '../src/constants/map.svg';
import SmokerWeb from '../src/constants/smokerWeb.svg';

import Instagram from '../src/constants/Instagram.svg';
import Twitter from '../src/constants/Twitter.svg';
import Youtube from '../src/constants/Youtube.svg';
import SendMail from '../src/constants/sent-mail.svg';

import Package from '../src/constants/boxes.svg';
import Fruits from '../src/constants/fruits';
import Link from '../src/components/Link';

const config = {
	angle: 90,
	spread: 360,
	startVelocity: '57',
	elementCount: '200',
	dragFriction: '0.21',
	duration: '4840',
	stagger: '1',
	width: '10px',
	height: '10px',
	perspective: '1000px',
};

// import Link from '../src/components/Link';

Geocode.setApiKey('AIzaSyAZgRxUwivhQa667FiBY8jYjsQ12EPbj1A');
Geocode.setLanguage('en');
Geocode.setRegion('en');
Geocode.enableDebug(true);

const FRUITS = [
	{
		name: 'Mint',
		icon: Fruits.Mint,
		left: -55,
		colors: ['#3e8c11', '#276f13', '#5ed01d', '#0edf00', '#60d91b'],
	},
	{
		name: 'Watermelon',
		icon: Fruits.Watermelon,
		left: -55,
		colors: ['#FD2A28', '#FE7562', '#80CC2A', '#76BC1C', '#E0163B'],
	},
	{
		name: 'Grape',
		icon: Fruits.Grape,
		left: -45,
		colors: ['#47173A', '#651F55', '#95207E', '#5B5C28', '#9B745A'],
	},
	{
		name: 'Grapefruit',
		icon: Fruits.Grapefruit,
		left: -55,
		colors: ['#F18314', '#D02C24', '#EC3A2E', '#F89E11', '#FCF881', '#FBC034'],
	},
	{
		name: 'Mango',
		icon: Fruits.Mango,
		left: -55,
		colors: ['#F89E17', '#EEEE24', '#F68518', '#F6CE17', '#F47217'],
	},
	{
		name: 'Berry',
		icon: Fruits.Berry,
		left: -45,
		colors: ['#AB1935', '#D31841', '#BE193C', '#247E3A', '#F03D7E'],
	},
	{
		name: 'Lemon',
		icon: Fruits.Lemon,
		left: -55,
		colors: ['#FFF9BF', '#F5E50D', '#FFFFFF', '#FCF21B', '#EFDA0E'],
	},
	{
		name: 'Blueberry',
		icon: Fruits.Blueberry,
		left: -55,
		colors: ['#122E67', '#13357B', '#1B62F2', '#42831F', '#E0E0E0'],
	},
	{
		name: 'Passionfruit',
		icon: Fruits.Passionfruit,
		left: -50,
		colors: ['#540D2E', '#E31374', '#F6BF4B', '#39976A', '#FBFBFB'],
	},
	{
		name: 'Peach',
		icon: Fruits.Peach,
		left: -55,
		colors: ['#F7911E', '#F47418', '#F8A035', '#F0451D', '#2B5324'],
	},
];

const LOCATIONS = [
	{ name: 'Philadelphia, PA', latitude: 39.9526, longitude: -75.1652 },
	{ name: 'Bensalem, PA', latitude: 40.103, longitude: -74.948 },
	{ name: 'Willow Grove, PA', latitude: 40.144, longitude: -75.1157 },
];

const FEATURE_LIST = [
	{
		Title: 'Free Delivery',
		Body:
			'No need to worry about a delivery hassle. Unlike other delivery services, we don’t charge an arm and a leg to get to you. Our delivery is free, timely, and quality assured!',
		Icon: FreeDelivery,
	},

	{
		Title: 'One Stop Shop',
		Body: `We’ll provide you with everything you need to get that buzz going. From the coal, to the lighter and tips. We’ve got you covered.`,
		Icon: Package,
	},

	{
		Title: 'Carefully crafted',
		Body: `Our diffused portable hookahs are small enough to fit in your car’s cup holder without shaking and needing adjustment. With about 1.5 hours of smoke time, you could even take that bad boy out for a five mile walk.`,
		Icon: BoxHearts,
	},
];

const useStyles = makeStyles((theme: Theme) => ({
	activeIndicator: {
		color: '#FC510D',
		height: 35,
	},
	// test

	menuHolder: {
		maxHeight: 400,
		position: 'absolute',
		top: '100%',
		width: '100%',
		overflow: 'scroll',
		backgroundColor: 'white',
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.1)',
	},

	padding1: {
		padding: 25,
		transition: theme.transitions.create(['padding', 'backgroundColor'], {
			duration: theme.transitions.duration.complex,
			easing: theme.transitions.easing.easeInOut,
		}),
	},

	isMobilePadding: {
		padding: 15,
	},

	setCompressed: {
		padding: 0,
		backgroundColor: '#BCB5B4',
		transition: theme.transitions.create(['padding', 'backgroundColor'], {
			duration: theme.transitions.duration.complex,
			easing: theme.transitions.easing.easeInOut,
		}),
	},

	padding2: {
		padding: 35,
		transition: theme.transitions.create(['padding', 'backgroundColor'], {
			duration: theme.transitions.duration.complex,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
}));

const LocationInput = inject('store')(
	observer((props: any) => {
		const { store } = props;

		console.log(store);

		const [isFocused, setIsFocused] = useState(false);
		const classes = useStyles();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const inputRef = useRef<any>();

		const [chosenAddress, setChosenAddress] = useState(store.address || '');

		useEffect(() => {
			setChosenAddress(store.address);
		}, [store.address]);

		const {
			ready,
			value,
			suggestions: { data },
			setValue,
			clearSuggestions,
		} = usePlacesAutocomplete({
			requestOptions: { types: ['address'] },
		});

		const useCurrentLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((success: any) => {
					Geocode.fromLatLng(
						success.coords.latitude.toString(),
						success.coords.longitude.toString()
					).then((response) => {
						setIsFocused(false);
						setChosenAddress(
							response.results.filter(
								(address: any) =>
									address.types.findIndex(
										(b: any) =>
											b === 'establishment' ||
											b === 'street_address' ||
											b === 'premise' ||
											b === 'RANGE_INTERPOLATED'
									) > -1
							)[0].formatted_address
						);
					});
				});
			}
		};

		useEffect(() => {
			if (!isFocused) {
				if (inputRef && inputRef.current && inputRef.current.blur) {
					inputRef.current.blur();
				}
			}
		}, [isFocused]);

		return (
			<NoSsr>
				<div
					style={{
						marginTop: 35,
						width: '100%',
					}}
				>
					<ClickAwayListener
						onClickAway={() => {
							setIsFocused(false);
						}}
					>
						<FormControl
							style={{
								position: 'relative',
							}}
							fullWidth
						>
							<InputBase
								disabled={!ready}
								inputRef={inputRef}
								autoComplete="off"
								onFocus={() => {
									setIsFocused(true);
								}}
								onChange={(e: any) => {
									e.persist();
									setValue(e.target.value);
								}}
								onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
									e.persist();

									// if (e.keyCode === 46 || e.keyCode === 8) {
									if (chosenAddress !== '') {
										// @ts-ignore
										setValue(e.target.value);
										setChosenAddress('');
									}
									// }
								}}
								onBlur={(e: any) => {
									if (isFocused) {
										e.target.focus();
									}
								}}
								fullWidth
								value={(chosenAddress !== '' && chosenAddress) || value}
								startAdornment={
									(ready && (
										<LocationOnOutlined
											style={{ color: '#FC340A', marginRight: 15 }}
										/>
									)) || (
										<div style={{ padding: 0, marginRight: 15 }}>
											<CircularProgress
												size={24}
												color="primary"
												style={{ alignSelf: 'center' }}
											/>
										</div>
									)
								}
								endAdornment={
									<Button
										variant="contained"
										disableRipple
										color="primary"
										disabled={!chosenAddress || chosenAddress === ''}
										onClick={() => {
											store.changeAddress(chosenAddress);
										}}
										href="/items"
									>
										<ArrowRightAlt color="inherit" />
									</Button>
								}
								style={{
									backgroundColor: 'white',
									padding: 16,
									fontSize: 16,
									borderRadius: 15,
									fontWeight: 600,
									overflow: 'visible',
									borderBottomLeftRadius: (!isFocused && 15) || 0,
									borderBottomRightRadius: (!isFocused && 15) || 0,
									zIndex: 3,
								}}
								placeholder="Enter Your Drop off Address"
							/>
							<Collapse
								in={isFocused}
								timeout="auto"
								unmountOnExit
								style={{ zIndex: 2 }}
							>
								<div className={clsx(classes.menuHolder, {})}>
									<ButtonBase
										onClick={useCurrentLocation}
										style={{
											justifyContent: 'flex-start',
											display: 'flex',
											alignItems: 'center',
											alignContent: 'center',
											flexDirection: 'row',
											padding: 20,
											paddingLeft: 30,
											width: '100%',
											backgroundColor: 'white',
										}}
									>
										<div
											style={{
												width: '100%',
												backgroundColor: '#E7E7E7',
												height: 1,
												position: 'absolute',
												top: 0,
												left: 0,
											}}
										/>
										<SendMail
											style={{ marginRight: 30 }}
											width={30}
											height={30}
											fill="#FC510D"
										/>
										<Typography
											variant="body1"
											color="textPrimary"
											style={{
												fontWeight: 500,
												lineHeight: 1,
												alignSelf: 'center',
											}}
										>
											Use Current Location
										</Typography>
									</ButtonBase>
									{data.map((suggestion: Suggestion) => {
										const {
											id,
											// eslint-disable-next-line @typescript-eslint/naming-convention
											structured_formatting: { main_text, secondary_text },
										} = suggestion;
										return (
											<ButtonBase
												key={id}
												onClick={() => {
													clearSuggestions();
													setChosenAddress(suggestion.description);
													setIsFocused(false);
												}}
												style={{
													justifyContent: 'flex-start',
													display: 'flex',
													alignItems: 'center',
													alignContent: 'center',
													flexDirection: 'row',
													padding: 20,
													paddingLeft: 30,
													width: '100%',
													backgroundColor: 'white',
												}}
											>
												<div
													style={{
														width: '100%',
														backgroundColor: '#E7E7E7',
														height: 1,
														position: 'absolute',
														top: 0,
														left: 0,
													}}
												/>
												<LocationOnOutlined
													style={{ marginRight: 30 }}
													width={30}
													height={30}
													fill="black"
												/>
												<div>
													<Typography
														variant="body1"
														color="textPrimary"
														gutterBottom
														style={{
															fontWeight: 500,
															lineHeight: 1,
															alignSelf: 'flex-start',
															textAlign: 'left',
														}}
													>
														{main_text}
													</Typography>
													<Typography
														variant="body2"
														color="textPrimary"
														style={{
															fontWeight: 400,
															lineHeight: 1,
															alignSelf: 'flex-start',
															textAlign: 'left',
														}}
													>
														{secondary_text}
													</Typography>
												</div>
											</ButtonBase>
										);
									})}
								</div>
							</Collapse>
						</FormControl>
					</ClickAwayListener>
				</div>
			</NoSsr>
		);
	})
);

const HomeWeb = () => {
	return (
		<Grid
			container
			spacing={4}
			style={{
				backgroundColor: '#FFE8DA',
				borderRadius: 55,
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				marginBottom: 55,
			}}
		>
			<Grid
				item
				xs={12}
				md={5}
				style={{
					alignContent: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: 'flex',
					maxWidth: 440,
				}}
			>
				<Typography
					variant="button"
					component="h2"
					style={{ fontWeight: 600, alignSelf: 'flex-start' }}
				>
					Welcome to
				</Typography>
				<Typography
					variant="h2"
					component="h1"
					style={{
						fontWeight: 'bold',
						color: '#FC510D',
						alignSelf: 'flex-start',
					}}
				>
					Sheesha
				</Typography>
				<Typography
					variant="subtitle2"
					style={{ maxWidth: 440, textAlign: 'justify' }}
				>
					Whether you’re Netflix and chilling, planning an event, or anything in
					between we’ve got you covered! The most annoying part of hookah is
					preparing it, so leave that to us. Sit back, relax, and just puff
					away!
				</Typography>
				<LocationInput />
			</Grid>
			<Grid
				item
				xs={12}
				md={7}
				style={{
					alignContent: 'center',
					alignItems: 'flex-end',
					flexDirection: 'column',
					display: 'flex',
				}}
			>
				<div
					style={{
						display: 'inline',
						position: 'relative',
					}}
				>
					<div
						style={{
							position: 'relative',
							borderRadius: 50000,
							width: 450,
							height: 450,
							background:
								'radial-gradient(87.06% 57.52% at 48.78% 42.48%, rgba(252, 81, 13, 0) 0%, #FC510D 66.15%)',
						}}
					>
						<HomePhoto style={{ position: 'absolute', top: 25, left: -40 }} />
					</div>
					<div
						style={{
							position: 'absolute',
							top: 50,
							left: -50,
							borderRadius: 50000,
							width: 70,
							height: 70,
							background: '#FC510D',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 30,
							left: -100,
							borderRadius: 50000,
							width: 20,
							height: 20,
							background: '#FC510D',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 150,
							left: -50,
							borderRadius: 50000,
							width: 25,
							height: 25,
							background:
								'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 50,
							right: 0,
							borderRadius: 50000,
							width: 40,
							height: 40,
							background:
								'radial-gradient(39.11% 36.36% at 50% 50%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.5) 100%)',
						}}
					/>
				</div>
			</Grid>
		</Grid>
	);
};

const HomeMobile = () => {
	return (
		<Grid
			container
			spacing={2}
			style={{
				backgroundColor: '#FFE8DA',
				borderRadius: 20,
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				paddingTop: 23,
			}}
		>
			<Grid
				item
				xs={12}
				style={{
					alignContent: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					justifyItems: 'center',
					flexDirection: 'column',
					display: 'flex',
					paddingBottom: 15,
				}}
			>
				<div
					style={{
						display: 'inline',
						position: 'relative',
					}}
				>
					<div
						style={{
							position: 'relative',
							borderRadius: 50000,
							width: 220,
							height: 220,
							background:
								'radial-gradient(87.06% 57.52% at 48.78% 42.48%, rgba(252, 81, 13, 0) 0%, #FC510D 66.15%)',
						}}
					>
						<HomePhotoMobile
							style={{ position: 'absolute', top: 15, left: -15 }}
						/>
					</div>
					<div
						style={{
							position: 'absolute',
							top: 25,
							left: -25,
							borderRadius: 50000,
							width: 30,
							height: 30,
							background: '#FC510D',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 15,
							left: -50,
							borderRadius: 50000,
							width: 10,
							height: 10,
							background: '#FC510D',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 75,
							left: -25,
							borderRadius: 50000,
							width: 15,
							height: 15,
							background:
								'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: 25,
							right: 0,
							borderRadius: 50000,
							width: 20,
							height: 20,
							background:
								'radial-gradient(39.11% 36.36% at 50% 50%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.5) 100%)',
						}}
					/>
				</div>
			</Grid>
			<Grid
				item
				xs={12}
				md={5}
				style={{
					alignContent: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: 'flex',
					maxWidth: 340,
				}}
			>
				<Typography
					variant="subtitle2"
					style={{ fontWeight: 600, alignSelf: 'flex-start' }}
				>
					Welcome to
				</Typography>
				<Typography
					variant="h2"
					component="h1"
					style={{
						fontWeight: 'bold',
						color: '#FC510D',
						alignSelf: 'flex-start',
					}}
				>
					Sheesha
				</Typography>
				<Typography
					variant="subtitle2"
					style={{ maxWidth: 440, textAlign: 'justify' }}
				>
					Whether you’re Netflix and chilling, planning an event, or anything in
					between we’ve got you covered! The most annoying part of hookah is
					preparing it, so leave that to us. Sit back, relax, and just puff
					away!
				</Typography>
			</Grid>

			<Grid item xs={12} style={{ padding: 30 }}>
				<LocationInput />
			</Grid>
		</Grid>
	);
};

const FeaturesWeb = () => {
	return (
		<Grid
			container
			spacing={8}
			style={{
				alignItems: 'center',
				justifyItems: 'center',
				alignContent: 'center',
				alignSelf: 'center',
				justifyContent: 'center',
			}}
		>
			{FEATURE_LIST.map((feature) => (
				<Grid
					key={feature.Title}
					item
					md={4}
					xs={12}
					style={{ height: '100%' }}
				>
					<Card
						elevation={0}
						style={{
							padding: 25,
							paddingTop: 40,
							paddingBottom: 60,
							borderRadius: 25,
							minHeight: 380,
						}}
					>
						<div
							style={{
								padding: 15,
								width: 'fit-content',
								backgroundColor: '#FFE8DA',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
								borderRadius: 15,
							}}
						>
							<feature.Icon width={40} height={40} fill="#FC510D" />
						</div>

						<Typography
							variant="h6"
							style={{ fontWeight: 600, marginTop: 20 }}
							gutterBottom
						>
							{feature.Title}
						</Typography>

						<Typography
							variant="body2"
							color="textSecondary"
							style={{ textAlign: 'justify' }}
						>
							{feature.Body}
						</Typography>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

const FooterWeb = () => {
	return (
		<Grid
			container
			style={{
				backgroundColor: '#3B1204',
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				color: 'white',
				padding: 35,
				paddingBottom: 0,
			}}
		>
			<Grid
				item
				xs={12}
				md={5}
				style={{
					alignSelf: 'flex-end',
					alignItems: 'flex-start',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					justifyItems: 'flex-end',
					display: 'flex',
					height: '100%',
					marginBottom: 0,
				}}
			>
				<SmokerWeb />
			</Grid>
			<Grid
				item
				xs={12}
				md={7}
				style={{
					alignContent: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: 'flex',
					maxWidth: 500,
					padding: 30,
				}}
			>
				<Typography
					variant="h3"
					component="h1"
					style={{
						fontWeight: 600,
						alignSelf: 'center',
						marginBottom: 12,
					}}
				>
					Ready To Order?
				</Typography>
				<Typography
					variant="subtitle2"
					style={{ maxWidth: 500, textAlign: 'justify', fontWeight: 400 }}
				>
					Everything’s included so there’s nothing you have to do, other than
					enjoy the next hour and half with your sheesha products! Just start by
					entering you address below.
				</Typography>

				<LocationInput />

				<div style={{ paddingTop: 20 }}>
					<Typography
						variant="h6"
						style={{ fontWeight: 600, marginBottom: 10 }}
						gutterBottom
					>
						Connect With Us!
					</Typography>

					<a href="https://twitter.com/SheeshaMobile">
						<Twitter style={{ marginRight: 25 }} />
					</a>

					<a href="https://instagram.com/SheeshaApp">
						<Instagram style={{ marginRight: 25 }} />
					</a>

					<a href="https://youtube.com/SheeshaApp">
						<Youtube style={{}} />
					</a>
				</div>
			</Grid>
		</Grid>
	);
};

const FooterMobile = () => {
	return (
		<Grid
			container
			style={{
				backgroundColor: '#3B1204',
				alignContent: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				color: 'white',
				padding: 20,
				paddingBottom: 0,
			}}
		>
			<Grid
				item
				xs={12}
				md={7}
				style={{
					alignContent: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: 'flex',
					maxWidth: 500,
					paddingTop: 30,
					paddingBottom: 30,
				}}
			>
				<Typography
					variant="h3"
					component="h1"
					style={{
						fontWeight: 600,
						alignSelf: 'center',
						marginBottom: 12,
						paddingLeft: 20,
					}}
				>
					Ready To Order?
				</Typography>
				<Typography
					variant="subtitle2"
					style={{
						maxWidth: 500,
						textAlign: 'justify',
						fontWeight: 400,
						paddingLeft: 20,
						paddingRight: 20,
					}}
				>
					Everything’s included so there’s nothing you have to do, other than
					enjoy the next hour and half with your sheesha products! Just start by
					entering you address below.
				</Typography>

				<LocationInput />

				<div style={{ paddingTop: 20 }}>
					<Typography
						variant="h6"
						style={{ fontWeight: 600, marginBottom: 10 }}
						gutterBottom
					>
						Connect With Us!
					</Typography>

					<a href="https://twitter.com/SheeshaMobile">
						<Twitter style={{ marginRight: 25 }} />
					</a>

					<a href="https://instagram.com/SheeshaApp">
						<Instagram style={{ marginRight: 25 }} />
					</a>

					<a href="https://youtube.com/SheeshaApp">
						<Youtube style={{}} />
					</a>
				</div>
			</Grid>

			<Grid
				item
				xs={12}
				md={5}
				style={{
					alignSelf: 'flex-end',
					alignItems: 'flex-start',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					justifyItems: 'flex-end',
					display: 'flex',
					height: '100%',
					marginBottom: 0,
				}}
			>
				<SmokerWeb />
			</Grid>
		</Grid>
	);
};

const FeaturesMobile = () => {
	const classes = useStyles();

	return (
		// @ts-ignore
		<Carousel
			navButtonsAlwaysInvisible
			animation="slide"
			activeIndicatorProps={{ className: classes.activeIndicator }}
			indicatorContainerProps={{ style: { height: 50 } }}
		>
			{FEATURE_LIST.map((feature) => (
				<Card
					key={feature.Title}
					elevation={0}
					style={{
						marginLeft: '10%',
						marginRight: '10%',
						padding: 25,
						paddingTop: 40,
						paddingBottom: 30,
						borderRadius: 25,
						minHeight: 355,
					}}
				>
					<div
						style={{
							padding: 15,
							width: 'fit-content',
							backgroundColor: '#FFE8DA',
							alignItems: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							alignSelf: 'center',
							justifyContent: 'center',
							borderRadius: 15,
						}}
					>
						<feature.Icon width={40} height={40} fill="#FC510D" />
					</div>

					<Typography
						variant="h6"
						style={{ fontWeight: 600, marginTop: 20 }}
						gutterBottom
					>
						{feature.Title}
					</Typography>

					<Typography
						variant="body2"
						color="textSecondary"
						style={{ textAlign: 'justify' }}
					>
						{feature.Body}
					</Typography>
				</Card>
			))}
		</Carousel>
	);
};

const index: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const isSmallScreen = useMediaQuery((theme: Theme) =>
			theme.breakpoints.down('sm')
		);

		const [selectedLocation, setSelectedLocation] = useState(
			'Philadelphia, PA'
		);

		const [start, setStart] = useState({});
		const [compressed, setCompressed] = useState<any>({});

		const classes = useStyles();

		return (
			<>
				<Layout>
					<Grid
						container
						spacing={3}
						style={{
							justifyContent: 'center',
						}}
					>
						<Grid item xs={12}>
							{(isSmallScreen && <HomeMobile />) || <HomeWeb />}
						</Grid>

						<Grid
							item
							xs={12}
							style={{
								marginTop: 50,
								maxWidth: 1200,
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
							}}
						>
							{(isSmallScreen && <FeaturesMobile />) || <FeaturesWeb />}
						</Grid>

						<Grid
							item
							xs={12}
							style={{
								marginTop: 50,
								maxWidth: 1200,
								paddingLeft: '5%',
								paddingRight: '5%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography
								variant="h4"
								align="center"
								style={{ fontWeight: 600, marginBottom: 55 }}
							>
								Flavors
							</Typography>

							<Grid
								container
								spacing={(isSmallScreen && 3) || 8}
								style={{
									alignItems: 'center',
									justifyItems: 'center',
									alignContent: 'center',
									alignSelf: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
								}}
							>
								{FRUITS.map((fruit) => (
									<Grid key={fruit.name} item xs={6} md={3}>
										<Paper
											elevation={1}
											onClick={() => {
												// @ts-ignore
												if (!start[fruit.name]) {
													setCompressed((a: any) => ({
														...a,
														[fruit.name]: true,
													}));

													setTimeout(() => {
														setCompressed((a: any) => ({
															...a,
															[fruit.name]: false,
														}));

														setStart((a: any) => ({
															...a,
															[fruit.name]: true,
														}));
														setTimeout(() => {
															setStart((a: any) => ({
																...a,
																[fruit.name]: false,
															}));
														}, 400);
													}, 175);
												}
											}}
											className={clsx(classes.padding1, {
												[classes.isMobilePadding]: isSmallScreen,

												// @ts-ignore
												[classes.setCompressed]:
													compressed[fruit.name] || false,

												// @ts-ignore
												[classes.padding2]: start[fruit.name] || false,
											})}
											style={{
												alignContent: 'center',
												justifyContent: 'center',
												justifyItems: 'center',
												alignItems: 'center',
												display: 'flex',
												position: 'relative',
												borderRadius: 10,
												flexDirection: 'column',
											}}
										>
											{(isSmallScreen && (
												<fruit.icon width={122} height={122} style={{}} />
											)) || (
												<fruit.icon
													width={122}
													height={122}
													style={{
														position: 'absolute',
														left: fruit.left,
													}}
												/>
											)}
											<Typography
												variant={(isSmallScreen && 'subtitle2') || 'body1'}
												style={{ fontWeight: 500, zIndex: 30 }}
											>
												{fruit.name}
												<Confetti
													// @ts-ignore
													active={start[fruit.name]}
													// @ts-ignore
													config={{
														...config,
														colors: fruit.colors || [
															'#a864fd',
															'#29cdff',
															'#78ff44',
															'#ff718d',
															'#fdff6a',
														],
													}}
												/>
											</Typography>
										</Paper>
									</Grid>
								))}
							</Grid>
						</Grid>

						<Grid
							item
							xs={12}
							style={{
								marginTop: 80,
								maxWidth: 1200,
								paddingLeft: '5%',
								paddingRight: '5%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
								backgroundColor: (isSmallScreen && '#F5F3F2') || 'transparent',
								borderRadius: 25,
							}}
						>
							<Typography
								variant="h4"
								align="center"
								style={{
									fontWeight: 600,
									marginBottom: 55,
									marginTop: (isSmallScreen && 25) || 0,
								}}
							>
								Currently Servicing
							</Typography>
							{(isSmallScreen && (
								<>
									<NoSsr>
										<Grid
											item
											xs={12}
											style={{
												height: 300,
												width: '100%',
												overflow: 'hidden',
											}}
										>
											<ReactMapGL
												mapStyle="mapbox://styles/mapbox/streets-v11"
												mapboxApiAccessToken="pk.eyJ1IjoibW9kZWVrIiwiYSI6ImNrYjE1OGdrYzBnaDIyc3BmODNoZnU2aGQifQ.1XiE3bbs8yZQsVhiV-ObsQ"
												latitude={
													LOCATIONS.find((a) => a.name === selectedLocation)
														?.latitude
												}
												longitude={
													LOCATIONS.find((a) => a.name === selectedLocation)
														?.longitude
												}
												dragPan={false}
												dragRotate={false}
												scrollZoom={false}
												doubleClickZoom={false}
												touchRotate={false}
												touchZoom={false}
												keyboard={false}
												touchAction="pan-y"
												width="100%"
												height="100%"
												zoom={12}
												attributionControl={false}
											/>
										</Grid>
									</NoSsr>

									<Grid
										item
										xs={12}
										style={{
											marginTop: 30,
											maxHeight: 370,
										}}
									>
										{LOCATIONS.map((location) => (
											<ButtonBase
												key={location.name}
												onClick={() => {
													setSelectedLocation(location.name);
												}}
												style={{
													marginBottom: 20,
													justifyContent: 'flex-start',
													alignItems: 'center',
													alignContent: 'center',
													flexDirection: 'row',
													padding: 10,
													width: '100%',
													borderRadius: 10,
													backgroundColor:
														(location.name === selectedLocation && '#FC510D') ||
														'white',

													color: 'white',
												}}
											>
												<div
													style={{
														padding: 10,
														width: 'fit-content',
														backgroundColor:
															(location.name === selectedLocation &&
																'#FD743D') ||
															'#FFE8DA',
														alignItems: 'center',
														justifyItems: 'center',
														alignContent: 'center',
														alignSelf: 'center',
														justifyContent: 'center',
														borderRadius: 7,
														marginRight: 15,
													}}
												>
													<Map
														width={20}
														height={20}
														fill={
															(location.name === selectedLocation && 'white') ||
															'#FC510D'
														}
													/>
												</div>
												<Typography
													variant="body1"
													color={
														(location.name === selectedLocation && 'inherit') ||
														'textPrimary'
													}
													style={{ fontWeight: 500 }}
												>
													{location.name}
												</Typography>
											</ButtonBase>
										))}
									</Grid>
								</>
							)) || (
								<Grid
									container
									spacing={5}
									style={{
										padding: 35,
										backgroundColor: '#F5F3F2',
										borderRadius: 25,
									}}
								>
									<Grid
										item
										xs={12}
										md={6}
										style={{
											marginTop: 30,
											overflow: 'scroll',
											justifyContent:
												(LOCATIONS.length > 4 && 'flex-start') || 'center',
											justifyItems:
												(LOCATIONS.length > 4 && 'flex-start') || 'center',
											alignContent: 'center',
											alignItems: 'center',
											display: 'flex',
											flexDirection: 'column',
											paddingRight: 60,
											maxHeight: 400,
										}}
									>
										{LOCATIONS.map((location) => (
											<ButtonBase
												key={location.name}
												onClick={() => {
													setSelectedLocation(location.name);
												}}
												style={{
													marginBottom: 20,
													justifyContent: 'flex-start',
													alignItems: 'center',
													alignContent: 'center',
													flexDirection: 'row',
													padding: 15,
													width: '100%',
													borderRadius: 10,
													backgroundColor:
														(location.name === selectedLocation && '#FC510D') ||
														'white',

													color: 'white',
												}}
											>
												<div
													style={{
														padding: 10,
														width: 'fit-content',
														backgroundColor:
															(location.name === selectedLocation &&
																'#FD743D') ||
															'#FFE8DA',
														alignItems: 'center',
														justifyItems: 'center',
														alignContent: 'center',
														alignSelf: 'center',
														justifyContent: 'center',
														borderRadius: 7,
														marginRight: 15,
													}}
												>
													<Map
														width={20}
														height={20}
														fill={
															(location.name === selectedLocation && 'white') ||
															'#FC510D'
														}
													/>
												</div>
												<Typography
													variant="body1"
													color={
														(location.name === selectedLocation && 'inherit') ||
														'textPrimary'
													}
													style={{ fontWeight: 500 }}
												>
													{location.name}
												</Typography>
											</ButtonBase>
										))}
									</Grid>

									<Grid
										item
										xs={12}
										md={6}
										style={{
											height: 400,
											width: '100%',
											overflow: 'hidden',
										}}
									>
										<NoSsr>
											<ReactMapGL
												mapStyle="mapbox://styles/mapbox/streets-v11"
												mapboxApiAccessToken="pk.eyJ1IjoibW9kZWVrIiwiYSI6ImNrYjE1OGdrYzBnaDIyc3BmODNoZnU2aGQifQ.1XiE3bbs8yZQsVhiV-ObsQ"
												latitude={
													LOCATIONS.find((a) => a.name === selectedLocation)
														?.latitude
												}
												longitude={
													LOCATIONS.find((a) => a.name === selectedLocation)
														?.longitude
												}
												dragPan={false}
												dragRotate={false}
												scrollZoom={false}
												doubleClickZoom={false}
												touchRotate={false}
												touchZoom={false}
												keyboard={false}
												touchAction="pan-y"
												width="100%"
												height="100%"
												zoom={12}
												attributionControl={false}
											/>
										</NoSsr>
									</Grid>
								</Grid>
							)}
						</Grid>
					</Grid>

					{/* <Button variant="outlined" color="primary" size="large" fullWidth>
					<Link
						href="/order"
						color="inherit"
						style={{
							width: '100%',
						}}
					>
						Order
					</Link>
				</Button> */}

					{/* {store.address && store.address.formatted_address && (
					<Typography variant="button">
						{`Chosen Address ${store.address.formatted_address}`}
					</Typography>
				)} */}
				</Layout>
				<div style={{ marginTop: 80 }}>
					{(isSmallScreen && <FooterMobile />) || <FooterWeb />}
				</div>
			</>
		);
	})
);

export default index;
