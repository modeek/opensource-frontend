import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	ButtonBase,
	ButtonGroup,
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
import next, { NextPage } from 'next';

import {
	Add,
	ArrowRightAlt,
	LocationOnOutlined,
	PlusOne,
	Remove,
	ShoppingBasket,
} from '@material-ui/icons';

import Carousel from 'react-material-ui-carousel';
import ReactMapGL from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import usePlacesAutocomplete, { Suggestion } from 'use-places-autocomplete';

import Geocode from 'react-geocode';
import { Rating } from '@material-ui/lab';
import { useRouter } from 'next/router';
import Layout from '../../src/constants/Layout';
import ShoppingCartIcon from '../../src/constants/shoppingCard.svg';
import HomePhotoMobile from '../../src/constants/homePhotoMobile.svg';
import FreeDelivery from '../../src/constants/freeDelivery.svg';
import BoxHearts from '../../src/constants/boxHearts.svg';
import StopWatch from '../../src/constants/stopwatch.svg';
import Map from '../../src/constants/map.svg';
import SmokerWeb from '../../src/constants/smokerWeb.svg';

import HeadSVG from '../../src/constants/Head.svg';
import GrapefruitSVG from '../../src/constants/Grapefruit.svg';
import GrapefruitHead from '../../src/constants/GrapefruitHead.svg';

import Driver from '../../src/constants/Driver.svg';

import Instagram from '../../src/constants/Instagram.svg';
import Twitter from '../../src/constants/Twitter.svg';
import Youtube from '../../src/constants/Youtube.svg';
import SendMail from '../../src/constants/sent-mail.svg';

import Package from '../../src/constants/boxes.svg';
import Fruits from '../../src/constants/fruits';
import Link from '../../src/components/Link';
import Hookah from '../../src/constants/Hookah.svg';

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

// import Link from '../../src/components/Link';

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

	show: {
		overflow: 'visible',
	},

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
						...props.style,
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
								style={{ zIndex: 100000000000 }}
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
const HomeWeb = inject('store')(
	observer((props: any) => {
		const { store } = props;
		return (
			<Grid
				container
				spacing={4}
				style={{
					backgroundColor: '#FFE8DA',
					borderRadius: 30,
					marginBottom: 55,
					position: 'relative',
				}}
			>
				<Grid
					item
					xs={12}
					md={9}
					lg={8}
					xl={7}
					style={{
						alignContent: 'flex-start',
						justifyContent: 'flex-start',
						alignItems: 'flex-end',
						flexDirection: 'row',
						display: 'flex',
						paddingTop: 0,
						paddingLeft: 0,
						paddingRight: 0,
						position: 'relative',
					}}
				>
					<Driver
						height={315}
						style={{
							marginTop: -45,
							marginRight: -45,
							transform: `translate(${'0'}px, ${'60'}px)`,
						}}
					/>
					<div
						style={{
							alignContent: 'flex-start',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							flexDirection: 'column',
							display: 'flex',
							position: 'relative',
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: -105,
								left: -25,
								borderRadius: 50000,
								zIndex: 100,
								width: 75,
								height: 75,
								background:
									'radial-gradient(79.06% 73.51% at 99.38% 89.58%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
							}}
						/>
						<div
							style={{
								position: 'absolute',
								top: -40,
								right: 80,
								borderRadius: 50000,
								zIndex: 100,
								width: 50,
								height: 50,
								background:
									'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
							}}
						/>
						<Typography
							variant="h6"
							style={{ textAlign: 'left', fontWeight: 600 }}
						>
							Drop Off Address
						</Typography>
						<LocationInput
							style={{ marginTop: 10, width: 400, marginBottom: 40 }}
						/>
					</div>

					<div
						style={{
							position: 'absolute',
							top: '25%',
							right: '10%',
							borderRadius: 50000,
							zIndex: 100,
							width: 55,
							height: 55,
							background:
								'radial-gradient(71.1% 66.11% at 36.56% 81.63%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>

					<div
						style={{
							position: 'absolute',
							bottom: -20,
							right: '0%',
							borderRadius: 50000,
							zIndex: 100,
							width: 80,
							height: 80,
							background:
								'radial-gradient(85.86% 79.84% at 18.83% 0.46%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={3}
					lg={4}
					xl={5}
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'flex-end',
						flexDirection: 'column',
						display: 'flex',
						paddingLeft: 0,
						paddingRight: 30,
						height: '100% !important',
						position: 'relative',
					}}
				>
					<div
						style={{
							position: 'absolute',
							borderRadius: 50000,
							zIndex: 100,
							width: 40,
							height: 40,
							top: -10,
							left: '10%',
							background:
								'radial-gradient(56.29% 54.81% at 17.91% 79.89%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<div
						style={{
							borderRadius: 50000,
							zIndex: 100,
							width: 50,
							height: 50,
							marginBottom: 15,
							marginRight: 40,
							background:
								'radial-gradient(60.09% 64.62% at 88.01% 20.06%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<Button
						style={{ borderRadius: 10 }}
						variant="contained"
						color="primary"
						size="large"
						disableElevation
						endIcon={
							<ShoppingCartIcon
								fill="white"
								style={{
									backgroundColor: 'rgba(200, 200, 200, 0.25)',
									padding: 10,
									width: 50,
									height: 50,
									borderRadius: 10,
								}}
							/>
						}
					>
						<Typography
							variant="h6"
							component="text"
							style={{
								color: 'white',
								fontWeight: 600,
								fontSize: '1.2rem',
							}}
						>
							{store.items.reduce(
								(accumulator: any, currentValue: any) =>
									accumulator + currentValue.Quantity,
								0
							)}{' '}
							Items
						</Typography>
					</Button>
					<Typography
						variant="h6"
						component="text"
						color="primary"
						style={{
							fontWeight: 700,
							fontSize: '1.2rem',
							marginTop: 12,
						}}
					>
						11:08am
					</Typography>
					<div
						style={{
							flexDirection: 'row',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							alignContent: 'center',
							marginTop: -10,
						}}
					>
						<StopWatch width={50} height={50} />
						<Typography
							variant="h6"
							component="text"
							color="textPrimary"
							style={{
								fontWeight: 600,
								fontSize: '1.3rem',
								marginLeft: 10,
							}}
						>
							45 Minutes
						</Typography>
					</div>
				</Grid>
			</Grid>
		);
	})
);

const HomeMobile = inject('store')(
	observer((props: any) => {
		const { store } = props;
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
					marginBottom: 30,
				}}
			>
				<Grid
					item
					xs={12}
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						justifyItems: 'center',
						display: 'flex',
						position: 'relative',
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: '25%',
							right: -5,
							borderRadius: 50000,
							zIndex: 100,
							width: 50,
							height: 50,
							background:
								'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							bottom: '15%',
							right: '10%',
							borderRadius: 50000,
							zIndex: 100,
							width: 25,
							height: 25,
							transform: 'rotate(119.58deg)',
							background:
								'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							bottom: '15%',
							left: '10%',
							borderRadius: 50000,
							zIndex: 100,
							width: 35,
							height: 35,
							transform: 'rotate(-152.39deg)',
							background:
								'radial-gradient(87.38% 81.25% at 81.25% 0%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={9}
					lg={8}
					xl={7}
					style={{
						alignContent: 'flex-start',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						flexDirection: 'column',
						display: 'flex',
						paddingTop: 0,
						paddingLeft: 20,
						paddingRight: 20,
						position: 'relative',
					}}
				>
					<Typography
						variant="h6"
						style={{ textAlign: 'left', fontWeight: 600 }}
					>
						Drop Off Address
					</Typography>
					<LocationInput
						style={{ marginTop: 10, width: '100%', marginBottom: 40 }}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					md={3}
					lg={4}
					xl={5}
					style={{
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'flex-end',
						flexDirection: 'column',
						display: 'flex',
						paddingLeft: 0,
						paddingRight: 30,
						height: '100% !important',
						position: 'relative',
						marginBottom: 10,
					}}
				>
					<div
						style={{
							position: 'absolute',
							borderRadius: 50000,
							zIndex: 100,
							width: 40,
							height: 40,
							top: -10,
							left: '10%',
							background:
								'radial-gradient(56.29% 54.81% at 17.91% 79.89%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							borderRadius: 50000,
							zIndex: 100,
							width: 70,
							height: 70,
							bottom: -30,
							left: '10%',
							background:
								'radial-gradient(77.84% 72.38% at 13.47% 0.52%, rgba(252, 81, 13, 0) 0%, rgba(252, 81, 13, 0.9) 100%)',
						}}
					/>
					<Button
						style={{ borderRadius: 10 }}
						variant="contained"
						color="primary"
						size="large"
						disableElevation
						endIcon={
							<ShoppingCartIcon
								fill="white"
								width={30}
								height={30}
								style={{
									backgroundColor: 'rgba(200, 200, 200, 0.25)',
									padding: 10,
									width: 40,
									height: 40,
									borderRadius: 10,
								}}
							/>
						}
					>
						<Typography
							variant="h6"
							component="text"
							style={{
								color: 'white',
								fontWeight: 600,
								fontSize: '1rem',
							}}
						>
							{store.items.reduce(
								(accumulator: any, currentValue: any) =>
									accumulator + currentValue.Quantity,
								0
							)}{' '}
							Items
						</Typography>
					</Button>
					<Typography
						variant="h6"
						component="text"
						color="primary"
						style={{
							fontWeight: 700,
							fontSize: '1.1rem',
							marginTop: 12,
						}}
					>
						11:08am
					</Typography>
					<div
						style={{
							flexDirection: 'row',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							alignContent: 'center',
							marginTop: -10,
						}}
					>
						<StopWatch width={40} height={40} />
						<Typography
							variant="h6"
							component="text"
							color="textPrimary"
							style={{
								fontWeight: 600,
								fontSize: '1.2rem',
								marginLeft: 10,
							}}
						>
							45 Minutes
						</Typography>
					</div>
				</Grid>
			</Grid>
		);
	})
);

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

const HEADS = [
	{
		Name: 'None',
		Price: 0,
		Icon: HeadSVG,
	},
	{
		Name: 'Grapefruit',
		Price: 5,
		Icon: GrapefruitSVG,
	},
];

const index: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const isSmallScreen = useMediaQuery((theme: Theme) =>
			theme.breakpoints.down('sm')
		);

		const classes = useStyles();

		const [selected, setSelected] = useState('None');
		const [quantity, setQuantity] = useState(1);
		const [landed, setLanded] = useState(false);
		const [flavors, setFlavors] = useState<Array<any>>([]);

		const router = useRouter();

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => {
			if (
				typeof window !== 'undefined' &&
				!landed &&
				typeof window.orientation !== 'undefined'
			) {
				window.scrollTo(0, 485);
				setLanded(true);
			}
		});
		return (
			<>
				<Layout>
					<Grid container spacing={3}>
						<Grid item xs={12} style={{ marginBottom: 100 }}>
							{(isSmallScreen && <HomeMobile />) || <HomeWeb />}
						</Grid>
					</Grid>
					<div
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							width: '100%',
							display: 'flex',
						}}
					>
						<Grid
							container
							spacing={3}
							alignItems="stretch"
							direction="row"
							style={{
								maxWidth: 950,
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
								display: 'flex',
							}}
						>
							<Grid
								item
								xs={12}
								md={6}
								style={{
									alignItems: 'flex-end',
									justifyItems: 'flex-end',
									alignContent: 'flex-end',
									alignSelf: 'flex-end',
									justifyContent: (isSmallScreen && 'center') || 'flex-end',
									height: '100%',
									display: 'flex',
								}}
							>
								<Card
									elevation={0}
									style={{
										overflow: 'visible',
										borderRadius: 25,
										alignItems: 'center',
										justifyItems: 'center',
										alignContent: 'center',
										justifyContent: 'center',
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
										height: '100%',
										position: 'relative',
										maxWidth: (isSmallScreen && 280) || 360,
									}}
								>
									<Hookah width="100%" style={{ marginTop: '-25%' }} />
									{selected === 'Grapefruit' && (
										<GrapefruitHead
											width="100%"
											style={{
												position: 'absolute',
												top: 0,
												marginTop: '-25%',
											}}
										/>
									)}

									<Grid
										container
										spacing={3}
										style={{
											marginTop: 30,
											padding: 20,
											paddingTop: 0,
											alignItems: 'center',
											justifyItems: 'center',
											alignContent: 'center',
											justifyContent: 'center',
										}}
									>
										{[0, 1, 2].map((num) => {
											// @ts-ignore
											const IconImage =
												FRUITS.find((a) => {
													return (
														a.name === ((flavors[num] && flavors[num]) || '')
													);
												})?.icon || null;
											return (
												<Grid
													item
													xs={4}
													style={{
														alignItems: 'center',
														justifyItems: 'center',
														alignContent: 'center',
														justifyContent: 'center',
													}}
												>
													<div
														style={{
															backgroundColor: 'white',
															borderRadius: 15,
															aspectRatio: '1/1',
															maxHeight: (isSmallScreen && 60) || 90,
															height: (isSmallScreen && 60) || 90,
														}}
													>
														{IconImage && <IconImage width="100%" />}
													</div>
												</Grid>
											);
										})}
									</Grid>
								</Card>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								style={{
									alignItems: 'center',
									justifyItems: 'center',
									alignContent: 'center',
									alignSelf: 'center',
									justifyContent: 'center',
									height: '100%',
								}}
							>
								<Typography
									variant={(isSmallScreen && 'h5') || 'h4'}
									align="left"
									style={{ fontWeight: 600 }}
								>
									Portable Hookah
								</Typography>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignContent: 'center',
										alignItems: 'center',
									}}
								>
									<Rating value={5} readOnly />
									<Typography
										color="primary"
										variant="h6"
										align="left"
										style={{ fontWeight: 700, marginLeft: 10 }}
									>
										$25
									</Typography>
								</div>
								<Typography
									color="textSecondary"
									variant={(isSmallScreen && 'body2') || 'body1'}
									align="left"
									paragraph
									style={{
										marginTop: 15,
										width: (isSmallScreen && '100%') || 400,
										textAlign: 'justify',
									}}
								>
									Our portable hookah is packed by a professional expert with
									the top most tobacco. We not only include the coals, lighter
									and hose to start smoking. We include tongs to insure all goes
									well.
								</Typography>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										marginTop: 30,
										alignItems: 'center',
										justifyContent: (isSmallScreen && 'center') || 'flex-start',
										justifyItems: (isSmallScreen && 'center') || 'flex-start',

										maxWidth: '100%',
										overflow: 'hidden',
										flexWrap: 'wrap',
									}}
								>
									{HEADS.map((head) => (
										<ButtonBase
											onClick={() => {
												setSelected(head.Name);
											}}
											style={{
												borderRadius: 5000,
												backgroundColor:
													(selected === head.Name && '#FC510D') || '#F9F5F2',
												padding: 10,
												marginRight: 20,
												display: 'flex',
												flexDirection: 'column',
												color: (selected === head.Name && 'white') || 'inherit',
											}}
										>
											<div
												style={{
													padding: 10,
													borderRadius: 10000,
													backgroundColor: 'white',
												}}
											>
												<head.Icon
													width={(isSmallScreen && 30) || 50}
													height={(isSmallScreen && 30) || 50}
												/>
											</div>
											<Typography
												variant="button"
												color="inherit"
												style={{
													marginTop: 10,
													fontSize: (isSmallScreen && '1.1rem') || '1.3rem',
													fontWeight: 600,
												}}
											>
												+ ${head.Price}
											</Typography>
										</ButtonBase>
									))}
									{isSmallScreen && (
										<div
											style={{
												height: 'fit-content',
												display: 'flex',
												flexDirection: 'row',
												backgroundColor: '#F9F5F2',
												// boxShadow: '0px 37.0833px 92.7083px rgba(50, 50, 50, 0.2)',
												borderRadius: 12,
												minWidth: 'fit-content',
												alignContent: 'center',
												justifyItems: 'center',
												alignItems: 'center',
												justifyContent: 'center',
												overflow: 'hidden',
												marginTop: 15,
												marginBottom: 15,
												marginRight: 20,
											}}
										>
											<ButtonBase
												style={{
													padding: (isSmallScreen && 10) || 15,
													borderTopLeftRadius: 12,
													borderBottomLeftRadius: 12,
												}}
												onClick={() => {
													setQuantity(Math.max(1, quantity - 1));
												}}
												disabled={quantity <= 1}
											>
												<Remove fontSize="large" />
											</ButtonBase>
											<div
												style={{
													height: 40,
													width: 1,
													backgroundColor: 'black',
												}}
											/>
											<Typography
												variant="button"
												align="center"
												style={{
													fontSize: (isSmallScreen && '1.5rem') || '1.75rem',
													fontWeight: 700,
													paddingRight: 25,
													paddingLeft: 25,
													minWidth: 75,
												}}
											>
												{quantity}
											</Typography>
											<div
												style={{
													height: 40,
													width: 1,
													backgroundColor: 'black',
												}}
											/>
											<ButtonBase
												style={{
													padding: (isSmallScreen && 10) || 15,
													borderTopRightRadius: 12,
													borderBottomRightRadius: 12,
												}}
												onClick={() => {
													setQuantity(Math.min(9, quantity + 1));
												}}
											>
												<Add fontSize="large" />
											</ButtonBase>
										</div>
									)}
								</div>

								{!isSmallScreen && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											marginTop: 30,
										}}
									>
										{!isSmallScreen && (
											<div
												style={{
													marginRight: 30,
													height: 'fit-content',
													display: 'flex',
													flexDirection: 'row',
													backgroundColor: '#F9F5F2',
													// boxShadow: '0px 37.0833px 92.7083px rgba(50, 50, 50, 0.2)',
													borderRadius: 12,
													minWidth: 'fit-content',
													alignContent: 'center',
													justifyItems: 'center',
													alignItems: 'center',
													justifyContent: 'center',
													overflow: 'hidden',
												}}
											>
												<ButtonBase
													style={{
														padding: 15,
														borderTopLeftRadius: 12,
														borderBottomLeftRadius: 12,
													}}
													onClick={() => {
														setQuantity(Math.max(1, quantity - 1));
													}}
													disabled={quantity <= 1}
												>
													<Remove
														fontSize={(isSmallScreen && 'small') || 'large'}
													/>
												</ButtonBase>
												<div
													style={{
														height: 40,
														width: 1,
														backgroundColor: 'black',
													}}
												/>
												<Typography
													variant="button"
													align="center"
													style={{
														fontSize: (isSmallScreen && '1.5rem') || '1.75rem',
														fontWeight: 700,
														paddingRight: 25,
														paddingLeft: 25,
														minWidth: 75,
													}}
												>
													{quantity}
												</Typography>
												<div
													style={{
														height: 40,
														width: 1,
														backgroundColor: 'black',
													}}
												/>
												<ButtonBase
													style={{
														padding: 15,
														borderTopRightRadius: 12,
														borderBottomRightRadius: 12,
													}}
													onClick={() => {
														setQuantity(Math.min(9, quantity + 1));
													}}
												>
													<Add
														fontSize={(isSmallScreen && 'small') || 'large'}
													/>
												</ButtonBase>
											</div>
										)}

										<Button
											color="primary"
											variant="contained"
											size="large"
											fullWidth
											style={{
												borderRadius: 12,
												fontWeight: 600,
												fontSize: '1.2rem',
												minHeight: 60,
											}}
											disabled={flavors.length <= 0}
											onClick={() => {
												const Flavors: any = [];
												flavors.forEach((flav) => {
													Flavors.push({ Name: flav });
												});
												store.changeItems([
													...store.items,
													{
														Name: 'Portable Hookah',
														Price: 25,
														Addons:
															(selected === 'Grapefruit' && [
																{ Name: 'Grapefruit Head', Price: 5 },
															]) ||
															[],
														Flavors,
														Quantity: quantity,
													},
												]);
												router.push('/items');
											}}
										>
											Add To Cart
										</Button>
									</div>
								)}
							</Grid>

							<Grid
								item
								xs={12}
								style={{
									marginTop: 50,
									alignItems: 'center',
									justifyItems: 'center',
									alignContent: 'center',
									alignSelf: 'center',
									justifyContent: 'center',
									display: 'flex',
									paddingLeft: (isSmallScreen && 12) || '12.5%',
								}}
							>
								<Grid
									container
									spacing={(isSmallScreen && 3) || 8}
									style={{
										alignItems: 'center',
										justifyItems: 'center',
										alignContent: 'center',
										alignSelf: 'center',
										justifyContent: 'center',
										display: 'flex',
									}}
								>
									<Grid item xs={12}>
										<Typography
											variant={(isSmallScreen && 'h5') || 'h4'}
											align="center"
											style={{ fontWeight: 600, marginTop: -30 }}
										>
											Choose Your Flavors
										</Typography>
									</Grid>
									{FRUITS.map((fruit) => {
										const isSelected =
											flavors.findIndex((a: any) => a === fruit.name) > -1;
										return (
											<Grid key={fruit.name} item xs={4} md={4}>
												<Paper
													onClick={() => {
														if (isSelected) {
															setFlavors(
																flavors.filter((a: any) => a !== fruit.name)
															);
														} else if (flavors.length < 3) {
															setFlavors([...flavors, fruit.name]);
														}
													}}
													elevation={0}
													style={{
														alignContent: 'center',
														justifyContent: 'center',
														justifyItems: 'center',
														alignItems: 'center',
														display: 'flex',
														position: 'relative',
														borderRadius: 10,
														flexDirection: 'column',
														padding: (isSmallScreen && 10) || 25,
														textDecoration: 'none',
														backgroundColor:
															(isSelected && '#FC510D') || '#F9F5F2',
														// color: (isSelected && 'white') || '#272626',
													}}
													component="a"
												>
													{(isSmallScreen && (
														<fruit.icon
															width={75}
															height={75}
															style={{ zIndex: 5 }}
															fill="none"
														/>
													)) || (
														<fruit.icon
															width={130}
															height={130}
															style={{
																position: 'absolute',
																left: fruit.left,
																zIndex: 5,
															}}
															fill="none"
														/>
													)}
													<Typography
														variant={(isSmallScreen && 'subtitle2') || 'body1'}
														style={{
															fontWeight: 500,
															zIndex: 30,
															color: (isSelected && 'white') || '#272626',
														}}
													>
														{fruit.name}
													</Typography>
												</Paper>
											</Grid>
										);
									})}

									<Grid item xs={12}>
										{isSmallScreen && (
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													marginTop: 30,
												}}
											>
												{!isSmallScreen && (
													<div
														style={{
															marginRight: 30,
															height: 'fit-content',
															display: 'flex',
															flexDirection: 'row',
															backgroundColor: '#F9F5F2',
															// boxShadow: '0px 37.0833px 92.7083px rgba(50, 50, 50, 0.2)',
															borderRadius: 12,
															minWidth: 'fit-content',
															alignContent: 'center',
															justifyItems: 'center',
															alignItems: 'center',
															justifyContent: 'center',
															overflow: 'hidden',
														}}
													>
														<ButtonBase
															style={{
																padding: 15,
																borderTopLeftRadius: 12,
																borderBottomLeftRadius: 12,
															}}
															onClick={() => {
																setQuantity(Math.max(1, quantity - 1));
															}}
															disabled={quantity <= 1}
														>
															<Remove
																fontSize={(isSmallScreen && 'small') || 'large'}
															/>
														</ButtonBase>
														<div
															style={{
																height: 40,
																width: 1,
																backgroundColor: 'black',
															}}
														/>
														<Typography
															variant="button"
															align="center"
															style={{
																fontSize:
																	(isSmallScreen && '1.5rem') || '1.75rem',
																fontWeight: 700,
																paddingRight: 25,
																paddingLeft: 25,
																minWidth: 75,
															}}
														>
															{quantity}
														</Typography>
														<div
															style={{
																height: 40,
																width: 1,
																backgroundColor: 'black',
															}}
														/>
														<ButtonBase
															style={{
																padding: 15,
																borderTopRightRadius: 12,
																borderBottomRightRadius: 12,
															}}
															onClick={() => {
																setQuantity(Math.min(9, quantity + 1));
															}}
														>
															<Add
																fontSize={(isSmallScreen && 'small') || 'large'}
															/>
														</ButtonBase>
													</div>
												)}

												<Button
													color="primary"
													variant="contained"
													size="large"
													fullWidth
													style={{
														borderRadius: 12,
														fontWeight: 600,
														fontSize: '1.2rem',
														minHeight: 60,
													}}
													disabled={flavors.length <= 0}
													onClick={() => {
														const Flavors: any = [];
														flavors.forEach((flav) => {
															Flavors.push({ Name: flav });
														});
														store.changeItems([
															...store.items,
															{
																Name: 'Portable Hookah',
																Price: 25,
																Addons:
																	(selected === 'Grapefruit' && [
																		{ Name: 'Grapefruit Head', Price: 5 },
																	]) ||
																	[],
																Flavors,
																Quantity: quantity,
															},
														]);
														router.push('/items');
													}}
												>
													Add To Cart
												</Button>
											</div>
										)}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</div>
				</Layout>
				<div style={{ marginTop: 80 }}>
					{(isSmallScreen && <FooterMobile />) || <FooterWeb />}
				</div>
			</>
		);
	})
);

export default index;
