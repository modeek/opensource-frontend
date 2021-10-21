import React, { useEffect, useRef, useState } from 'react';

import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import {
	Avatar,
	Button,
	ButtonBase,
	ButtonGroup,
	Card,
	Checkbox,
	CircularProgress,
	ClickAwayListener,
	Collapse,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	InputBase,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	NoSsr,
	Paper,
	Popover,
	Select,
	TextField,
	Theme,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

import { inject, observer } from 'mobx-react';
import { NextPage } from 'next';
import { DropzoneArea } from 'material-ui-dropzone';

import {
	AddCircleOutline,
	ArrowRightAlt,
	Cancel,
	Check,
	CreditCard,
	Edit,
	EditAttributes,
	EditLocation,
	LocationOnOutlined,
	Message,
	Phone,
	RoomOutlined,
} from '@material-ui/icons';

import Carousel from 'react-material-ui-carousel';
import ReactMapGL from 'react-map-gl';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import usePlacesAutocomplete, { Suggestion } from 'use-places-autocomplete';

import Geocode from 'react-geocode';
import MaskedInput from 'react-text-mask';
import Axios from 'axios';
import ReactInputVerificationCode from 'react-input-verification-code';
import KeyboardDateInput from '@material-ui/pickers/_shared/KeyboardDateInput';
import { KeyboardDatePicker } from '@material-ui/pickers';
import {
	CardElement,
	Elements,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import Cards from '../src/constants/Cards';
import Layout from '../src/constants/Layout';
import ShoppingCartIcon from '../src/constants/shoppingCard.svg';
import HomePhotoMobile from '../src/constants/homePhotoMobile.svg';
import FreeDelivery from '../src/constants/freeDelivery.svg';
import BoxHearts from '../src/constants/boxHearts.svg';
import StopWatch from '../src/constants/stopwatch.svg';
import Map from '../src/constants/map.svg';
import SmokerWeb from '../src/constants/smokerWeb.svg';
import GrapefruitHead from '../src/constants/GrapefruitHead.svg';

import Driver from '../src/constants/Driver.svg';

import Instagram from '../src/constants/Instagram.svg';
import Twitter from '../src/constants/Twitter.svg';
import Youtube from '../src/constants/Youtube.svg';
import SendMail from '../src/constants/sent-mail.svg';

import Package from '../src/constants/boxes.svg';
import Fruits from '../src/constants/fruits';
import Link from '../src/components/Link';
import Hookah from '../src/constants/Hookah.svg';

import LogoSVG from '../src/constants/Logo.svg';
import { useInterval } from '../src/constants/util';
import getStripe from '../src/constants/get-stripe';

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

const USE_LOCAL_HOST = false;

Geocode.setApiKey('AIzaSyAZgRxUwivhQa667FiBY8jYjsQ12EPbj1A');
Geocode.setLanguage('en');
Geocode.setRegion('en');
Geocode.enableDebug(true);

const roundDownTo = (roundTo: any) => (x: any) =>
	Math.floor(x / roundTo) * roundTo;
const roundUpTo = (roundTo: any) => (x: any) =>
	Math.ceil(x / roundTo) * roundTo;
const roundDownTo5Minutes = roundDownTo(1000 * 60 * 5);
const roundUpTo5Minutes = roundUpTo(1000 * 60 * 5);

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
											props.clickOverride();
										}}
										href={(!props.clickOverride && '/items') || '#'}
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

		// @ts-ignore
		const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

		const handleClick = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorEl(anchorEl ? null : event.currentTarget);
		};

		const open = Boolean(anchorEl);

		let total = 0;

		store.items.forEach((order: any) => {
			total += order.Price * order.Quantity;
		});

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
				<div
					style={{
						position: 'absolute',
					}}
				>
					<NoSsr>
						<Popover
							open={open}
							// @ts-ignore
							onClose={() => {
								setAnchorEl(null);
							}}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							PaperProps={{
								style: {
									borderRadius: 25,
									backgroundColor: 'white',
									marginTop: 15,
								},
							}}
						>
							<Card
								style={{
									width: 370,
									zIndex: 3000,
									backgroundColor: 'white',
									borderRadius: 25,
								}}
							>
								<Typography
									variant="h6"
									style={{ fontWeight: 600, padding: 24 }}
								>
									Order
								</Typography>
								<Divider />
								{store.items.map((order: any) => {
									let flavors = '';
									order.Flavors.forEach((flav: any, index: number) => {
										flavors = flavors.concat(
											`${flav.Name}${
												(index >= order.Flavors.length - 1 && ' ') || ', '
											}`
										);
									});
									return (
										<>
											<div
												style={{
													padding: 16,
													paddingLeft: 24,
													display: 'flex',
												}}
											>
												<div style={{ flex: 1 }}>
													<Typography
														variant="button"
														style={{ fontSize: '1.1rem', fontWeight: 700 }}
													>
														{order.Quantity}
													</Typography>
													<Typography
														variant="button"
														style={{
															fontSize: '1rem',
															fontWeight: 500,
															marginLeft: 15,
														}}
													>
														{order.Name}
													</Typography>
													<Typography
														variant="body1"
														color="textSecondary"
														style={{
															fontSize: '1rem',
															fontWeight: 400,
														}}
													>
														{flavors}
													</Typography>
												</div>
												<div
													style={{
														flex: 0.3,
														alignContent: 'center',
														justifyItems: 'center',
														alignItems: 'center',
														justifyContent: 'center',
														display: 'flex',
														flexDirection: 'row',
													}}
												>
													<Typography
														variant="button"
														style={{
															fontSize: '1.1rem',
															fontWeight: 500,
															marginLeft: 20,
															marginRight: 10,
														}}
													>
														{(order.Quantity * order.Price).toLocaleString(
															'en-US',
															{
																style: 'currency',
																currency: 'USD',
															}
														)}
													</Typography>
													<ButtonBase disableRipple>
														<Cancel color="primary" />
													</ButtonBase>
												</div>
											</div>
											<Divider />
										</>
									);
								})}

								<div
									style={{
										padding: 16,
										paddingLeft: 24,
										display: 'flex',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{ fontSize: '1.1rem', fontWeight: 600 }}
										>
											Subtotal
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1.1rem',
												fontWeight: 600,
												marginLeft: 20,
												marginRight: 10,
											}}
										>
											{total.toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</Typography>
									</div>
								</div>
								<div style={{ width: '100%', display: 'flex', padding: '10%' }}>
									<Button
										color="primary"
										size="large"
										fullWidth
										variant="contained"
										disableElevation
										style={{
											borderRadius: 10,
											fontSize: '1.1rem',
											fontWeight: 600,
											padding: 15,
										}}
										endIcon={<ArrowRightAlt fontSize="large" />}
									>
										Checkout
									</Button>
								</div>
							</Card>
						</Popover>
					</NoSsr>
				</div>

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
						// @ts-ignore
						onClick={handleClick}
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

function StripeInput(props: any) {
	const { component: Component, inputRef, ...other } = props;
	const elementRef = React.useRef();

	React.useImperativeHandle(inputRef, () => ({
		// @ts-ignore
		focus: () => elementRef.current.focus,
	}));

	return (
		<Component
			// @ts-ignore
			onReady={(element: unknown) => (elementRef.current = element)}
			{...other}
		/>
	);
}

const HomeMobile = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

		const handleClick = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorEl(anchorEl ? null : event.currentTarget);
		};

		const open = Boolean(anchorEl);

		let total = 0;

		store.items.forEach((order: any) => {
			total += order.Price * order.Quantity;
			order.Addons.forEach((addon: any) => {
				total += addon.Price * order.Quantity;
			});
		});

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
				<div
					style={{
						position: 'absolute',
					}}
				>
					<NoSsr>
						<Popover
							open={open}
							// @ts-ignore
							onClose={() => {
								setAnchorEl(null);
							}}
							style={{
								width: '100%',
							}}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							PaperProps={{
								style: {
									borderRadius: 25,
									backgroundColor: 'white',
									marginTop: 15,
									width: '100%',
								},
							}}
						>
							<Card
								style={{
									width: '100%',
									zIndex: 3000,
									backgroundColor: 'white',
									borderRadius: 25,
									margin: 0,
								}}
							>
								<Typography
									variant="h6"
									style={{ fontWeight: 600, padding: 24 }}
								>
									Order
								</Typography>
								<Divider />
								{store.items.map((order: any, index: any) => {
									let flavors = '';
									order.Flavors.forEach((flav: any, index: number) => {
										flavors = flavors.concat(
											`${flav.Name}${
												(index >= order.Flavors.length - 1 && ' ') || ', '
											}`
										);
									});
									return (
										<>
											<div
												style={{
													padding: 16,
													paddingLeft: 24,
													display: 'flex',
												}}
											>
												<div style={{ flex: 1 }}>
													<Typography
														variant="button"
														style={{ fontSize: '1.1rem', fontWeight: 700 }}
													>
														{order.Quantity}
													</Typography>
													<Typography
														variant="button"
														style={{
															fontSize: '1rem',
															fontWeight: 500,
															marginLeft: 15,
														}}
													>
														{order.Name}
													</Typography>
													<Typography
														variant="body1"
														color="textSecondary"
														style={{
															fontSize: '1rem',
															fontWeight: 400,
														}}
													>
														{flavors}
													</Typography>
													{order.Addons.map((addon: any) => (
														<Typography
															variant="body1"
															color="textSecondary"
															style={{
																fontSize: '1rem',
																fontWeight: 400,
															}}
														>
															{addon.Name}
															<Typography
																variant="button"
																style={{
																	fontSize: '1rem',
																	fontWeight: 600,
																	marginLeft: 20,
																	marginRight: 10,
																}}
															>
																+
																{(order.Quantity * addon.Price).toLocaleString(
																	'en-US',
																	{
																		style: 'currency',
																		currency: 'USD',
																	}
																)}
															</Typography>
														</Typography>
													))}
												</div>
												<div
													style={{
														flex: 0.3,
														alignContent: 'center',
														justifyItems: 'center',
														alignItems: 'center',
														justifyContent: 'center',
														display: 'flex',
														flexDirection: 'row',
													}}
												>
													<div
														style={{
															alignContent: 'center',
															justifyItems: 'center',
															alignItems: 'center',
															justifyContent: 'center',
															display: 'flex',
															flexDirection: 'column',
														}}
													>
														<Typography
															variant="button"
															style={{
																fontSize: '1.1rem',
																fontWeight: 500,
																marginLeft: 20,
																marginRight: 10,
															}}
														>
															{(order.Quantity * order.Price).toLocaleString(
																'en-US',
																{
																	style: 'currency',
																	currency: 'USD',
																}
															)}
														</Typography>
													</div>
													<ButtonBase
														disableRipple
														onClick={() => {
															store.items = store.items.filter(
																(_: any, index2: any) => index2 !== index
															);
														}}
													>
														<Cancel color="primary" />
													</ButtonBase>
												</div>
											</div>
											<Divider />
										</>
									);
								})}

								<div
									style={{
										padding: 16,
										paddingLeft: 24,
										display: 'flex',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{ fontSize: '1.1rem', fontWeight: 600 }}
										>
											Subtotal
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1.1rem',
												fontWeight: 600,
												marginLeft: 20,
												marginRight: 10,
											}}
										>
											{total.toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</Typography>
									</div>
								</div>
								<div style={{ width: '100%', display: 'flex', padding: '10%' }}>
									<Button
										color="primary"
										size="large"
										fullWidth
										variant="contained"
										disableElevation
										style={{
											borderRadius: 10,
											fontSize: '1.1rem',
											fontWeight: 600,
											padding: 15,
										}}
										endIcon={<ArrowRightAlt fontSize="large" />}
									>
										Checkout
									</Button>
								</div>
							</Card>
						</Popover>
					</NoSsr>
				</div>

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
						// @ts-ignore
						onClick={handleClick}
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

const PRODUCTS = [
	{
		Name: 'Portable Hookah',
		Price: 25,
		Addons: [{ Name: 'Grapefruit Head', Price: 5 }],
		Flavors: [{ Name: 'Peach' }, { Name: 'Mint' }],
	},
	{
		Name: 'Portable Hookah',
		Price: 25,
		Addons: [],
		Flavors: [{ Name: 'Watermelon' }, { Name: 'Blueberry' }, { Name: 'Mint' }],
	},
	{
		Name: 'Portable Hookah',
		Price: 25,
		Addons: [],
		Flavors: [{ Name: 'Watermelon' }, { Name: 'Berry' }, { Name: 'Mint' }],
	},
	{
		Name: 'Portable Hookah',
		Price: 25,
		Addons: [],
		Flavors: [{ Name: 'Watermelon' }, { Name: 'Berry' }, { Name: 'Mint' }],
	},
];

const PreviousOrdersWeb = () => {
	return (
		// @ts-ignore
		<Grid
			container
			spacing={8}
			style={{
				alignItems: 'center',
				justifyItems: 'center',
				alignContent: 'center',
				justifyContent: 'center',
			}}
		>
			{PRODUCTS.map((feature) => (
				<Grid
					key={`${feature.Name} -${Math.random()}`}
					item
					md={3}
					xs={9}
					style={{ height: '100%' }}
				>
					<Card
						elevation={0}
						style={{
							overflow: 'visible',
							borderRadius: 25,
							aspectRatio: '1:1',
							alignItems: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
							display: 'flex',
							flexDirection: 'column',
							position: 'relative',
						}}
					>
						<Hookah width="80%" style={{ marginTop: '-35%' }} />
						{feature.Addons && feature.Addons.length > 0 && (
							<GrapefruitHead
								width="80%"
								style={{ marginTop: '-35%', position: 'absolute', top: 0 }}
							/>
						)}
						<div
							style={{
								flexDirection: 'row',
								display: 'flex',
								paddingLeft: 20,
								paddingRight: 20,
								width: '100%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography
								variant="body1"
								style={{
									fontWeight: 500,
									fontSize: '1.1rem',
									marginTop:
										feature.Addons && feature.Addons.length > 0 ? 6 : 10,
									textAlign:
										feature.Addons && feature.Addons.length > 0
											? 'left'
											: 'center',
								}}
							>
								{feature.Name}
							</Typography>
							{feature.Addons && feature.Addons.length > 0 && (
								<Typography
									variant="body1"
									color="primary"
									style={{
										fontWeight: 700,
										flex: 1,
										textAlign: 'right',
										fontSize: '1.25rem',
									}}
								>
									${feature.Price}
								</Typography>
							)}
						</div>

						{(feature.Addons &&
							feature.Addons.length > 0 &&
							feature.Addons.map((addon) => (
								<div
									style={{
										flexDirection: 'row',
										display: 'flex',
										paddingLeft: 20,
										paddingRight: 20,
										alignItems: 'center',
										justifyItems: 'center',
										alignContent: 'center',
										justifyContent: 'center',
										paddingBottom: 12,
										width: '100%',
									}}
								>
									<Typography
										variant="body1"
										style={{
											fontWeight: 500,
											fontSize: '1.1rem',
											textAlign: 'left',
										}}
									>
										{addon.Name}
									</Typography>
									<Typography
										variant="body1"
										color="primary"
										style={{
											fontWeight: 700,
											flex: 1,
											textAlign: 'right',
											fontSize: '1.25rem',
										}}
									>
										${addon.Price}
									</Typography>
								</div>
							))) || (
							<Typography
								variant="body1"
								color="primary"
								style={{
									fontWeight: 700,
									paddingLeft: 20,
									paddingBottom: 12,
									textAlign: 'center',
									fontSize: '1.25rem',
								}}
							>
								${feature.Price}
							</Typography>
						)}

						<Grid
							container
							spacing={1}
							style={{
								padding: 20,
								paddingTop: 0,
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
							}}
						>
							{feature.Flavors.map((flavor) => {
								// @ts-ignore
								const IconImage =
									FRUITS.find((a) => {
										return a.name === flavor.Name;
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
												width: '100%',
												height: '100%',
												backgroundColor: 'white',
												borderRadius: 15,
												aspectRatio: '1:1',
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
			))}
		</Grid>
	);
};

const PreviousOrdersMobile = () => {
	const classes = useStyles();

	return (
		<>
			{/* @ts-ignore */}
			<Carousel
				navButtonsAlwaysInvisible
				animation="slide"
				className={classes.show}
				activeIndicatorProps={{ className: classes.activeIndicator }}
				indicatorContainerProps={{ style: { height: 50 } }}
			>
				{PRODUCTS.map((feature) => (
					<Card
						key={`${feature.Name} -${Math.random()}`}
						elevation={0}
						style={{
							marginLeft: '10%',
							marginRight: '10%',
							padding: 25,
							paddingTop: 0,
							paddingBottom: 30,
							borderRadius: 25,
							minHeight: 355,
							overflow: 'visible',

							aspectRatio: '1:1',
							alignItems: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Hookah width="80%" style={{ marginTop: '-35%' }} />
						<div
							style={{
								flexDirection: 'row',
								display: 'flex',
								paddingLeft: 20,
								paddingRight: 20,
								width: '100%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography
								variant="body1"
								style={{
									fontWeight: 500,
									fontSize: '1.1rem',
									marginTop:
										feature.Addons && feature.Addons.length > 0 ? 6 : 10,
									textAlign:
										feature.Addons && feature.Addons.length > 0
											? 'left'
											: 'center',
								}}
							>
								{feature.Name}
							</Typography>
							{feature.Addons && feature.Addons.length > 0 && (
								<Typography
									variant="body1"
									color="primary"
									style={{
										fontWeight: 700,
										flex: 1,
										textAlign: 'right',
										fontSize: '1.25rem',
									}}
								>
									${feature.Price}
								</Typography>
							)}
						</div>

						{(feature.Addons &&
							feature.Addons.length > 0 &&
							feature.Addons.map((addon) => (
								<div
									style={{
										flexDirection: 'row',
										display: 'flex',
										paddingLeft: 20,
										paddingRight: 20,
										alignItems: 'center',
										justifyItems: 'center',
										alignContent: 'center',
										justifyContent: 'center',
										paddingBottom: 12,
										width: '100%',
									}}
								>
									<Typography
										variant="body1"
										style={{
											fontWeight: 500,
											fontSize: '1.1rem',
											textAlign: 'left',
										}}
									>
										{addon.Name}
									</Typography>
									<Typography
										variant="body1"
										color="primary"
										style={{
											fontWeight: 700,
											flex: 1,
											textAlign: 'right',
											fontSize: '1.25rem',
										}}
									>
										${addon.Price}
									</Typography>
								</div>
							))) || (
							<Typography
								variant="body1"
								color="primary"
								style={{
									fontWeight: 700,
									paddingLeft: 20,
									paddingBottom: 12,
									textAlign: 'center',
									fontSize: '1.25rem',
								}}
							>
								${feature.Price}
							</Typography>
						)}

						<Grid
							container
							spacing={1}
							style={{
								padding: 20,
								paddingTop: 0,
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
							}}
						>
							{feature.Flavors.map((flavor) => {
								// @ts-ignore
								const IconImage =
									FRUITS.find((a) => {
										return a.name === flavor.Name;
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
												width: '100%',
												height: '100%',
												backgroundColor: 'white',
												borderRadius: 15,
												aspectRatio: '1:1',
											}}
										>
											{IconImage && <IconImage width="100%" />}
										</div>
									</Grid>
								);
							})}
						</Grid>
					</Card>
				))}
			</Carousel>
		</>
	);
};

const HOOKAHS = [
	{
		Name: 'Portable Hookah',
		Price: 25,
		Description: 'All Supplies Included,\n\tChoose Up To 3 Flavors',
		Link: '/items/HookahToGo',
	},
];

const HookahToGoWeb = () => {
	return (
		// @ts-ignore
		<Grid
			container
			spacing={8}
			style={{
				alignItems: 'center',
				justifyItems: 'center',
				alignContent: 'center',
				justifyContent: 'center',
			}}
		>
			{HOOKAHS.map((feature) => (
				<Grid
					key={`${feature.Name} -${Math.random()}`}
					item
					md={3}
					xs={9}
					style={{ height: '100%' }}
				>
					<Card
						elevation={0}
						style={{
							overflow: 'visible',
							borderRadius: 25,
							aspectRatio: '1:1',
							alignItems: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
							display: 'flex',
							flexDirection: 'column',
							textDecoration: 'none',
						}}
						component="a"
						// @ts-ignore
						href={feature.Link}
					>
						<Hookah width="80%" style={{ marginTop: '-35%' }} />
						<div
							style={{
								flexDirection: 'row',
								display: 'flex',
								paddingLeft: 20,
								paddingRight: 20,
								width: '100%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
								marginTop: 15,
							}}
						>
							<Typography
								variant="body1"
								style={{
									fontWeight: 500,
									fontSize: '1.25rem',
									textAlign: 'left',
								}}
							>
								{feature.Name}
							</Typography>
							<Typography
								variant="body1"
								color="primary"
								style={{
									fontWeight: 700,
									flex: 1,
									textAlign: 'right',
									fontSize: '1.3rem',
								}}
							>
								${feature.Price}
							</Typography>
						</div>

						<Typography
							variant="subtitle1"
							color="textPrimary"
							paragraph
							style={{
								fontWeight: 500,
								marginTop: 10,
								padding: 12,
								textAlign: 'center',
							}}
						>
							{feature.Description}
						</Typography>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

const HookahToGoMobile = () => {
	const classes = useStyles();

	return (
		<>
			{/* @ts-ignore */}
			<Carousel
				navButtonsAlwaysInvisible
				animation="slide"
				className={classes.show}
				activeIndicatorProps={{ className: classes.activeIndicator }}
				indicatorContainerProps={{ style: { height: 50 } }}
			>
				{HOOKAHS.map((feature) => (
					<Card
						key={`${feature.Name} -${Math.random()}`}
						elevation={0}
						style={{
							marginLeft: '10%',
							marginRight: '10%',
							padding: 25,
							paddingTop: 0,
							paddingBottom: 30,
							borderRadius: 25,
							minHeight: 355,
							overflow: 'visible',

							aspectRatio: '1:1',
							alignItems: 'center',
							justifyItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
							display: 'flex',
							flexDirection: 'column',
							textDecoration: 'none',
						}}
						component="a"
						// @ts-ignore
						href={feature.Link}
					>
						<Hookah width="90%" style={{ marginTop: '-35%' }} />
						<div
							style={{
								flexDirection: 'row',
								display: 'flex',
								paddingLeft: 20,
								paddingRight: 20,
								width: '100%',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								justifyContent: 'center',
								marginTop: 15,
							}}
						>
							<Typography
								variant="body1"
								style={{
									fontWeight: 500,
									fontSize: '1.25rem',
									textAlign: 'left',
								}}
							>
								{feature.Name}
							</Typography>
							<Typography
								variant="body1"
								color="primary"
								style={{
									fontWeight: 700,
									flex: 1,
									textAlign: 'right',
									fontSize: '1.3rem',
								}}
							>
								${feature.Price}
							</Typography>
						</div>

						<Typography
							variant="subtitle1"
							color="textPrimary"
							paragraph
							style={{
								fontWeight: 500,
								marginTop: 10,
								padding: 12,
								textAlign: 'center',
							}}
						>
							{feature.Description}
						</Typography>
					</Card>
				))}
			</Carousel>
		</>
	);
};

function formatPhoneNumber(phoneNumberString: string): string {
	const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
	const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		const intlCode = match[1] ? '+1 ' : '';
		return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
	}
	return '';
}

interface TextMaskCustomProps {
	inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={(ref: any) => {
				inputRef(ref ? ref.inputElement : null);
			}}
			autoComplete="tel-national"
			mask={[
				'(',
				/[1-9]/,
				/\d/,
				/\d/,
				')',
				' ',
				/\d/,
				/\d/,
				/\d/,
				'-',
				/\d/,
				/\d/,
				/\d/,
				/\d/,
			]}
			style={{
				fontSize: '1.3rem',
				fontWeight: 600,
				textAlign: 'center',
				fontFamily: 'Poppins',
			}}
		/>
	);
}

function TextMaskCustom2(props: TextMaskCustomProps) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={(ref: any) => {
				inputRef(ref ? ref.inputElement : null);
			}}
			autoComplete="tel-national"
			mask={[
				'(',
				/[1-9]/,
				/\d/,
				/\d/,
				')',
				' ',
				/\d/,
				/\d/,
				/\d/,
				'-',
				/\d/,
				/\d/,
				/\d/,
				/\d/,
			]}
			style={{
				// fontSize: '1.3rem',
				fontWeight: 500,
				// textAlign: 'center',
				fontFamily: 'Poppins',
			}}
		/>
	);
}

const blobToBase64 = (blob: Blob) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);

	return new Promise((resolve) => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};

const index: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const isSmallScreen = useMediaQuery((theme: Theme) =>
			theme.breakpoints.down('sm')
		);

		const router = useRouter();

		const [landed, setLanded] = useState(false);
		const [order, setOrder] = useState<any>(props.order || {});

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => {
			if (
				typeof window !== 'undefined' &&
				!landed &&
				typeof window.orientation !== 'undefined'
			) {
				// window.scrollTo(0, 265);
				setLanded(true);
			}
		});

		useInterval(() => {
			fetch(
				`${
					(USE_LOCAL_HOST && 'http://localhost:3000') ||
					'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
				}/dev/getOrderStatus/${router.query.id}`,
				{
					headers: {
						'Content-Type': 'application/json',
						authToken: store.authToken,
					},

					method: 'get',
				}
			)
				.then((res: any) => res.json())
				.then((json: any) => {
					setOrder(json.order);
				});
		}, 1000 * 3);

		useInterval(() => {
			if (store.authToken && store.authToken.length > 5) {
				fetch(
					`${
						(USE_LOCAL_HOST && 'http://localhost:3000') ||
						'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
					}/dev/refreshToken`,
					{
						headers: {
							'Content-Type': 'application/json',
							authToken: store.authToken,
						},

						method: 'POST',
						// @ts-ignore
						body: JSON.stringify({}),
					}
				)
					.then((res: any) => res.json())
					.then((json: any) => {
						if (json.success) {
							store.setAuthToken(json.token);
						}
						if (json.clearToken) {
							store.setAuthToken('');
						}
					});
			}
		}, 1000 * 3);

		let token: any = {};
		let doneVerifying = false;

		jwt.verify(store.authToken, 'SheeshaToken123', (err: any, decoded: any) => {
			doneVerifying = true;
			if (err) {
				token = {};
			} else {
				token = decoded;
				if (!token.token || !token.token.expiresAt) {
					token = {};
					store.setAuthToken('');
				}
				if (
					token &&
					token.token &&
					new Date(token.token.expiresAt).getTime() < new Date().getTime()
				) {
					token = {};
					store.setAuthToken('');
				}
			}
		});

		let total = 0;

		if (order && order.items) {
			order.items.forEach((order: any) => {
				total += order.Price * order.Quantity;
				order.Addons.forEach((addon: any) => {
					total += addon.Price * order.Quantity;
				});
			});
		}

		// const cardBrand =
		// 	cardInfo.brand ||
		// 	(token && token.user && token.user.card && token.user.card.brand);
		const [selectedLocation, setSelectedLocation] = useState(
			'Philadelphia, PA'
		);

		return (
			<Layout>
				<Grid
					container
					spacing={3}
					style={{
						justifyContent: 'center',
						overflow: 'hidden',
					}}
				>
					<NoSsr>
						<Grid
							item
							xs={12}
							style={{
								height: (isSmallScreen && 300) || 500,
								width: '100%',
								overflow: 'hidden',
							}}
						>
							<ReactMapGL
								mapStyle="mapbox://styles/mapbox/streets-v11"
								mapboxApiAccessToken="pk.eyJ1IjoibW9kZWVrIiwiYSI6ImNrYjE1OGdrYzBnaDIyc3BmODNoZnU2aGQifQ.1XiE3bbs8yZQsVhiV-ObsQ"
								latitude={
									LOCATIONS.find((a) => a.name === selectedLocation)?.latitude
								}
								longitude={
									LOCATIONS.find((a) => a.name === selectedLocation)?.longitude
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
								zoom={13}
								attributionControl={false}
							/>
						</Grid>
					</NoSsr>
					<Grid item xs={12}>
						<NoSsr>
							<Typography
								color="textPrimary"
								variant="subtitle1"
								style={{
									marginTop: 20,
									fontWeight: 600,
									fontSize: '1.4rem',
									width: '100%',
								}}
								gutterBottom
							>
								Drop Off Address
							</Typography>
							<div>
								<Paper
									style={{
										width: '100%',
										padding: 15,
										paddingLeft: 12,

										borderRadius: 15,
										backgroundColor: 'white',
										boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.08)',
										border: '1px solid rgba(213, 213, 213, 0.33) !important',
										flexDirection: 'row',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<RoomOutlined color="primary" fontSize="large" />
									<Typography
										color="textSecondary"
										variant="subtitle1"
										style={{
											marginLeft: 10,
											fontWeight: 500,
											fontSize: '1.15rem',
										}}
									>
										{order.address}
									</Typography>
								</Paper>
							</div>
						</NoSsr>
					</Grid>

					<Grid item xs={12} md={5} lg={4}>
						<List
							style={{
								boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.08)',
								borderRadius: 24,
								border: '1px solid rgba(213, 213, 213, 0.33)',
								justifyContent: 'center',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								display: 'flex',
								flexDirection: 'column',
								padding: 20,
							}}
						>
							<ListItem
								style={{
									padding: 20,
									backgroundColor: '#FFEEE7',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									justifyItems: 'center',
									alignContent: 'center',
									borderRadius: 20,
									flexDirection: 'column',
									marginBottom: 20,
								}}
							>
								<Typography
									color="primary"
									variant="subtitle1"
									style={{
										fontWeight: 500,
										fontSize: '1rem',
									}}
								>
									Estimated Arrival Time
								</Typography>
								<Typography
									color="primary"
									variant="subtitle1"
									style={{
										fontWeight: 600,
										fontSize: '1.2rem',
									}}
								>
									{`${new Date(
										roundDownTo5Minutes(
											new Date(order.deliverAt).getTime() - 60 * 1000 * 15
										)
									).toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
									})}-${new Date(
										roundUpTo5Minutes(new Date(order.deliverAt))
									).toLocaleTimeString([], {
										hour: 'numeric',
										minute: '2-digit',
									})}`}
								</Typography>
							</ListItem>

							<div
								style={{
									height: 300,
									position: 'relative',
									alignItems: 'flex-start',
									justifyItems: 'center',
									justifyContent: 'space-around',
									alignContent: 'space-around',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<div
									style={{
										position: 'absolute',
										left: 13.5,
										top: '15%',
										height: '70%',
										border: '2px dashed #3B1204',
										strokeLinecap: 'round',
									}}
								/>
								<div
									style={{ zIndex: 1, display: 'flex', flexDirection: 'row' }}
								>
									<div
										style={{
											width: 30,
											height: 30,
											borderRadius: 40,
											backgroundColor:
												(order.status > 1 && '#FD3D08') || '#FE8B6B',
											zIndex: 3,
											border: '3px solid #FD3D08',
										}}
									/>
									<Typography
										color={order.status >= 1 ? 'primary' : 'textPrimary'}
										variant="subtitle1"
										style={{
											fontWeight: (order.status >= 1 && 600) || 500,
											fontSize: '1.1rem',
											marginLeft: 15,
										}}
									>
										Preparing Your Order
									</Typography>
								</div>

								<div
									style={{ zIndex: 1, display: 'flex', flexDirection: 'row' }}
								>
									<div
										style={{
											width: 30,
											height: 30,
											borderRadius: 40,
											backgroundColor:
												(order.status > 2 && '#FD3D08') ||
												(order.status > 1 && '#FE8B6B') ||
												'white',
											zIndex: 3,
											border: '3px solid #FD3D08',
										}}
									/>

									<Typography
										color={order.status >= 2 ? 'primary' : 'textPrimary'}
										variant="subtitle1"
										style={{
											fontWeight: (order.status >= 2 && 600) || 500,
											fontSize: '1rem',
											marginLeft: 15,
										}}
									>
										Your Order Is On Its Way!
									</Typography>
								</div>
								<div
									style={{ zIndex: 1, display: 'flex', flexDirection: 'row' }}
								>
									<div
										style={{
											width: 30,
											height: 30,
											borderRadius: 40,
											backgroundColor:
												(order.status > 3 && '#FD3D08') ||
												(order.status > 2 && '#FE8B6B') ||
												'white',
											zIndex: 3,
											border: '3px solid #FD3D08',
										}}
									/>

									<Typography
										color={order.status >= 2 ? 'primary' : 'textPrimary'}
										variant="subtitle1"
										style={{
											fontWeight: (order.status >= 2 && 600) || 500,
											fontSize: '1rem',
											marginLeft: 15,
										}}
									>
										Your Order Has been Delivered!
									</Typography>
								</div>
							</div>
						</List>
					</Grid>

					<Grid item xs={12} md={5} lg={4}>
						<List
							style={{
								boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.08)',
								borderRadius: 24,
								border: '1px solid rgba(213, 213, 213, 0.33)',
								justifyContent: 'center',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
								display: 'flex',
								flexDirection: 'column',
								padding: 15,
							}}
						>
							<ListItem style={{ padding: 5, marginBottom: 20 }}>
								<ListItemIcon>
									<Avatar
										alt="Remy Sharp"
										src="https://c.sheesha.app/WhiteGuy"
										style={{ width: 75, height: 75, marginRight: 25 }}
									/>
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography
											color="textPrimary"
											variant="subtitle1"
											style={{
												fontWeight: 600,
												fontSize: '1rem',
												width: '100%',
											}}
										>
											White Chocolate
										</Typography>
									}
									secondary={
										<Typography
											color="textSecondary"
											variant="subtitle1"
											style={{
												fontWeight: 500,
												fontSize: '1rem',
												width: '100%',
											}}
										>
											White BMW 3 Series
										</Typography>
									}
								/>
							</ListItem>
							<ButtonGroup
								variant="outlined"
								size="large"
								fullWidth
								style={{ borderRadius: 15 }}
							>
								<Button
									startIcon={<Message color="primary" />}
									style={{
										padding: 15,
										fontWeight: 600,
									}}
								>
									<a
										href="sms:+12676945129"
										style={{
											textDecorationColor: 'transparent',
											color: 'inherit',
										}}
									>
										Text Your Driver
									</a>
								</Button>
								<Button
									startIcon={<Phone color="primary" />}
									style={{
										padding: 15,
										fontWeight: 600,
									}}
								>
									<a
										href="tel:+12676945129"
										style={{
											textDecorationColor: 'transparent',
											color: 'inherit',
										}}
									>
										Call Your Driver
									</a>
								</Button>
							</ButtonGroup>
						</List>
					</Grid>

					<Grid item xs={12} md={5} lg={4}>
						<List
							style={{
								boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.08)',
								borderRadius: 24,
								border: '1px solid rgba(213, 213, 213, 0.33)',
								justifyContent: 'center',
								alignItems: 'center',
								justifyItems: 'center',
								alignContent: 'center',
							}}
						>
							<ListItem
								style={{
									padding: 20,

									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									justifyItems: 'center',
									alignContent: 'center',
								}}
							>
								<Typography
									color="textPrimary"
									variant="subtitle1"
									style={{
										fontWeight: 500,
										fontSize: '1.2rem',
										flex: 1,
									}}
								>
									Your Order
								</Typography>
							</ListItem>
							<Divider />
							{order.items.map((item: any) => {
								let flavors = '';
								item.Flavors.forEach((flav: any, index: number) => {
									flavors = flavors.concat(
										`${flav.Name}${
											(index >= item.Flavors.length - 1 && ' ') || ', '
										}`
									);
								});
								return (
									<>
										<ListItem
											style={{
												padding: 16,
												paddingLeft: 24,
												display: 'flex',
											}}
										>
											<div style={{ flex: 1 }}>
												<Typography
													variant="button"
													style={{ fontSize: '1.1rem', fontWeight: 700 }}
												>
													{item.Quantity}
												</Typography>
												<Typography
													variant="button"
													style={{
														fontSize: '1.1rem',
														fontWeight: 500,
														marginLeft: 15,
														textTransform: 'none',
													}}
												>
													{item.Name}
												</Typography>
												<Typography
													variant="body1"
													color="textSecondary"
													style={{
														fontSize: '1rem',
														fontWeight: 400,
													}}
												>
													{flavors}
												</Typography>
												{item.Addons.map((addon: any) => (
													<Typography
														variant="body1"
														color="textSecondary"
														style={{
															fontSize: '1rem',
															fontWeight: 400,
														}}
													>
														{addon.Name}
														<Typography
															variant="button"
															style={{
																fontSize: '1rem',
																fontWeight: 600,
																marginLeft: 20,
																marginRight: 10,
															}}
														>
															+
															{(item.Quantity * addon.Price).toLocaleString(
																'en-US',
																{
																	style: 'currency',
																	currency: 'USD',
																}
															)}
														</Typography>
													</Typography>
												))}
											</div>
											<div
												style={{
													flex: 0.3,
													alignContent: 'center',
													justifyItems: 'center',
													alignItems: 'center',
													justifyContent: 'center',
													display: 'flex',
													flexDirection: 'row',
												}}
											>
												<div
													style={{
														alignContent: 'center',
														justifyItems: 'center',
														alignItems: 'center',
														justifyContent: 'center',
														display: 'flex',
														flexDirection: 'column',
													}}
												>
													<Typography
														variant="button"
														style={{
															fontSize: '1.1rem',
															fontWeight: 500,
															marginLeft: 20,
															marginRight: 10,
														}}
													>
														{(item.Quantity * item.Price).toLocaleString(
															'en-US',
															{
																style: 'currency',
																currency: 'USD',
															}
														)}
													</Typography>
												</div>
											</div>
										</ListItem>
										<Divider />
									</>
								);
							})}
							<div style={{ flexDirection: 'column' }}>
								<div
									style={{
										padding: 16,
										paddingLeft: 24,
										paddingBottom: 0,
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{
												fontSize: '1.1rem',
												fontWeight: 500,
												textTransform: 'none',
											}}
										>
											Subtotal
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1.1rem',
												fontWeight: 500,
												marginLeft: 20,
												marginRight: 10,
											}}
										>
											{total.toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</Typography>
									</div>
								</div>

								<div
									style={{
										paddingLeft: 24,
										paddingRight: 16,
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{
												fontSize: '1.1rem',
												fontWeight: 500,
												textTransform: 'none',
											}}
										>
											Delivery Fee
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1rem',
												fontWeight: 600,
												marginLeft: 20,
												marginRight: 10,
												textTransform: 'none',
											}}
										>
											{`${'Included'}`}
										</Typography>
									</div>
								</div>

								<div
									style={{
										paddingLeft: 24,
										paddingRight: 16,
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{
												fontSize: '1.1rem',
												fontWeight: 500,
												textTransform: 'none',
											}}
										>
											Taxes
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1rem',
												fontWeight: 600,
												marginLeft: 20,
												marginRight: 10,
												textTransform: 'none',
											}}
										>
											{`${'Included'}`}
										</Typography>
									</div>
								</div>

								<div
									style={{
										paddingLeft: 24,
										paddingRight: 16,
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<div style={{ flex: 1 }}>
										<Typography
											variant="button"
											style={{
												fontSize: '1.1rem',
												fontWeight: 500,
												textTransform: 'none',
											}}
										>
											Driver's Tip
										</Typography>
									</div>
									<div
										style={{
											flex: 0.3,
											alignContent: 'center',
											justifyItems: 'center',
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											flexDirection: 'row',
										}}
									>
										<Typography
											variant="button"
											color="primary"
											style={{
												fontSize: '1rem',
												fontWeight: 600,
												marginLeft: 20,
												marginRight: 10,
												textTransform: 'none',
											}}
										>
											{order.driverTip.toLocaleString('en-US', {
												style: 'currency',
												currency: 'USD',
											})}
										</Typography>
									</div>
								</div>

								<div
									style={{
										marginTop: 20,
										paddingLeft: 24,
										paddingRight: 16,
										display: 'flex',
										flexDirection: 'row',
										marginBottom: 20,
									}}
								>
									<div
										style={{
											padding: 20,
											display: 'flex',
											flexDirection: 'row',
											flex: 1,
											backgroundColor: '#F1F1F1',
											borderRadius: 15,
											border: '1px solid #D9D9D9',
										}}
									>
										<div style={{ flex: 1 }}>
											<Typography
												variant="button"
												style={{
													fontSize: '1.2rem',
													fontWeight: 600,
													textTransform: 'none',
												}}
											>
												Total
											</Typography>
										</div>
										<div
											style={{
												flex: 0.3,
												alignContent: 'center',
												justifyItems: 'center',
												alignItems: 'center',
												justifyContent: 'center',
												display: 'flex',
												flexDirection: 'row',
											}}
										>
											<Typography
												variant="button"
												color="primary"
												style={{
													fontSize: '1.3rem',
													fontWeight: 600,
													marginLeft: 20,
													marginRight: 10,
													textTransform: 'none',
												}}
											>
												{total.toLocaleString('en-US', {
													style: 'currency',
													currency: 'USD',
												})}
											</Typography>
										</div>
									</div>
								</div>

								<Typography
									color="textPrimary"
									variant="subtitle1"
									style={{
										fontWeight: 500,
										fontSize: '1rem',
										width: '100%',
										marginLeft: 20,
										marginBottom: 10,
									}}
								>
									Amount Charged
								</Typography>
								<div
									style={{
										paddingLeft: 24,
										paddingRight: 16,
										display: 'flex',
										flexDirection: 'row',
										marginBottom: 20,
									}}
								>
									<div
										style={{
											padding: 17,
											display: 'flex',
											flexDirection: 'row',
											flex: 1,
											backgroundColor: '#FFEEE8',
											borderRadius: 15,
											border: '1px solid #FC510D',
										}}
									>
										<div style={{ flex: 1 }}>
											<Typography
												color="primary"
												variant="button"
												style={{
													fontSize: '1.1rem',
													fontWeight: 600,
													textTransform: 'none',
												}}
											>
												{`${order.card.brand.toUpperCase()} - x${
													order.card.last4
												}`}
											</Typography>
										</div>
										<div
											style={{
												flex: 0.3,
												alignContent: 'center',
												justifyItems: 'center',
												alignItems: 'center',
												justifyContent: 'center',
												display: 'flex',
												flexDirection: 'row',
											}}
										>
											<Typography
												variant="button"
												color="primary"
												style={{
													fontSize: '1.15rem',
													fontWeight: 600,
													marginLeft: 20,
													marginRight: 10,
													textTransform: 'none',
												}}
											>
												{order.totalPrice.toLocaleString('en-US', {
													style: 'currency',
													currency: 'USD',
												})}
											</Typography>
										</div>
									</div>
								</div>
							</div>
						</List>
					</Grid>
				</Grid>
			</Layout>
		);
	})
);

index.getInitialProps = async (ctx) => {
	const { req, query } = ctx;
	let order = {};
	await fetch(
		`${
			(USE_LOCAL_HOST && 'http://localhost:3000') ||
			'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
		}/dev/getOrderStatus/${query.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				// authToken: store.authToken,
			},

			method: 'get',
		}
	)
		.then((res: any) => res.json())
		.then((json: any) => {
			order = json.order;
		});

	return { order };
};

export default index;
