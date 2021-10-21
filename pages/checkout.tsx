import React, { useEffect, useRef, useState } from 'react';

import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import {
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

const CARD_OPTIONS = {
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: '#c4f0ff',
			color: '#fff',
			fontWeight: 500,
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': {
				color: '#fce883',
			},
			'::placeholder': {
				color: '#87bbfd',
			},
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee',
		},
	},
};

const ErrorMessage = ({ children }: any) => (
	<Typography
		variant="button"
		color="error"
		gutterBottom
		style={{ marginTop: 15 }}
	>
		{children}
	</Typography>
);

const CardField = ({ onChange }: any) => (
	<TextField
		fullWidth
		InputLabelProps={{
			shrink: true,
		}}
		onChange={onChange}
		label="Card Information"
		size="medium"
		required
		InputProps={{
			inputComponent: StripeInput,
			inputProps: {
				component: CardElement as any,
				options: {
					style: {
						base: {
							borderWidth: 0,
							fontSize: '17px',
							fontFamily: 'Poppins',
							'::placeholder': {
								color: '#CFD7DF',
							},
						},
					},
				},
			},
		}}
	/>
);

const SubmitButton = ({ processing, children, disabled }: any) => (
	<fieldset
		style={{
			borderWidth: 0,
			paddingLeft: '10%',
			paddingRight: '10%',
			minHeight: 60,
			display: 'flex',
			marginTop: 15,
			width: '100%',
			alignContent: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			justifyItems: 'center',
		}}
	>
		{(processing && <CircularProgress size={45} color="primary" />) || (
			<Button
				variant="contained"
				color="primary"
				size="large"
				disableElevation
				fullWidth
				style={{
					borderRadius: 10,
					fontSize: '1rem',
					fontWeight: 600,
					padding: 15,
				}}
				type="submit"
				disabled={processing || disabled}
			>
				{children}
			</Button>
		)}
	</fieldset>
);

const CheckoutForm = ({ phoneNumber, onPaymentMethod }: any) => {
	const stripe = useStripe();
	const elements: any = useElements();
	const [error, setError] = useState<any>(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<any>(null);
	const [billingDetails, setBillingDetails] = useState({
		// eslint-disable-next-line react/destructuring-assignment
		phone: phoneNumber,
		name: '',
	});

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		if (error && elements) {
			elements.getElement('card').focus();
			return;
		}

		if (cardComplete) {
			setProcessing(true);
		}

		const payload = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
			billing_details: { ...billingDetails, phone: phoneNumber },
		});

		setProcessing(false);

		if (payload.error) {
			setError(payload.error);
		} else {
			setPaymentMethod(payload.paymentMethod);
			onPaymentMethod(payload.paymentMethod);
		}
	};

	return paymentMethod ? (
		<div className="Result">
			<Typography variant="button">{`Payment Successful, pass ${JSON.stringify(
				paymentMethod
			)} to server!`}</Typography>

			{/* <ResetButton onClick={reset} /> */}
		</div>
	) : (
		<form className="Form" onSubmit={handleSubmit}>
			<fieldset style={{ borderWidth: 0 }}>
				<TextField
					fullWidth
					label="Cardholder Name"
					size="medium"
					style={{ marginBottom: 30 }}
					InputLabelProps={{
						shrink: true,
					}}
					id="name"
					type="text"
					required
					autoComplete="name"
					value={billingDetails.name}
					onChange={(e) => {
						setBillingDetails({ ...billingDetails, name: e.target.value });
					}}
				/>

				<CardField
					onChange={(e: any) => {
						setError(e.error);
						setCardComplete(e.complete);
					}}
				/>
				{error && <ErrorMessage>{error.message}</ErrorMessage>}
			</fieldset>

			<SubmitButton processing={processing} error={error} disabled={!stripe}>
				Save Card
			</SubmitButton>
		</form>
	);
};

const POSSIBLE_DRIVER_TIPS = [0, 0.08, 0.12, 0.15];

const index: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const isSmallScreen = useMediaQuery((theme: Theme) =>
			theme.breakpoints.down('sm')
		);

		const classes = useStyles();
		const [landed, setLanded] = useState(false);
		const [usedQuery, setUsedQuery] = useState(false);
		const [loading, setLoading] = useState(false);
		const [phoneNumber, setPhoneNumber] = useState('');
		const [sentText, setSentText] = useState(false);
		const [verificationCode, setVerificationCode] = useState('');
		const [SID, setSID] = useState('');
		const [error, setError] = useState('');

		const [birthday, setBirthday] = React.useState<any>(null);
		const [accepted, setAccepted] = useState(false);
		const [firstName, setFirstName] = useState('');
		const [lastName, setLastName] = useState('');
		const [picture, setPicture] = useState<any>();
		const router = useRouter();

		const handleBirthday = (date: any) => {
			setBirthday(date);
		};

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

		// @ts-ignore
		useEffect(() => {
			if (router.query.payment_intent && !usedQuery) {
				setUsedQuery(true);
				setLoading(true);
				fetch(
					`${
						(USE_LOCAL_HOST && 'http://localhost:3000') ||
						'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
					}/dev/submitOrder`,
					{
						headers: {
							'Content-Type': 'application/json',
							// @ts-ignore
							authToken: store.authToken,
						},

						method: 'POST',
						body: JSON.stringify({
							paymentIntentId: router.query.payment_intent,
						}),
					}
				)
					.then((result) => {
						return result.json();
					})
					.then((json) => {
						setLoading(false);

						if (json.error) {
							// @ts-ignore

							if (json.orderId) {
								router.push({
									pathname: '/trackOrder',
									query: {
										id: json.orderId,
									},
								});
							} else {
								alert(json.error);
							}
						} else {
							store.items = [];
							router.push({
								pathname: '/trackOrder',
								query: {
									id: json.orderId,
								},
							});
						}
					});
			} else if (!store.address && !usedQuery) {
				router.push({
					pathname: '/',
				});
			} else if (!usedQuery && store.items.length < 1) {
				router.push({
					pathname: '/items',
				});
			}
		});

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

		const [showChangeNumber, setShowChangeNumber] = useState(false);
		const [contactNumber, setContactNumber] = useState('');
		const [notes, setNotes] = useState('');

		const [showChangeAddress, setShowChangeAddress] = useState(false);
		const [showChangeCard, setShowChangeCard] = useState(false);

		const [cardInfo, setCardInfo] = useState<any>({});
		const [selectedDriverTip, setSelectedDriverTip] = useState<any>(0.08);

		let total = 0;

		store.items.forEach((order: any) => {
			total += order.Price * order.Quantity;
			order.Addons.forEach((addon: any) => {
				total += addon.Price * order.Quantity;
			});
		});

		const cardBrand =
			cardInfo.brand ||
			(token && token.user && token.user.card && token.user.card.brand);

		return (
			<>
				{((!doneVerifying ||
					store.authToken === '' ||
					!token ||
					!token.user ||
					!token.user.hasUploadedID) && (
					<>
						<div
							style={{
								minHeight: '-webkit-fill-available',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								alignContent: 'center',
								justifyItems: 'center',
								paddingLeft: '5%',
								paddingRight: '5%',
							}}
						>
							<Paper
								elevation={0}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									padding: 20,
									paddingTop: 40,
									paddingBottom: 50,
									borderRadius: 20,
									width: '100%',
									maxWidth: 500,
									backgroundColor: 'white',
									boxShadow: '5px 20px 50px rgba(0, 0, 0, 0.15)',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center',
										alignContent: 'center',
										justifyItems: 'center',
									}}
								>
									<LogoSVG height={90} width={90} />
									<Typography
										variant="h3"
										align="center"
										style={{
											marginTop: 25,
											fontFamily: 'Yatra One',
											marginLeft: -15,
										}}
									>
										heesha
									</Typography>
								</div>
								{(doneVerifying && (
									<>
										{(store.authToken !== '' && (
											<>
												{(token.user && token.user.hasUploadedID && (
													<>
														<Typography
															color="primary"
															variant="subtitle1"
															style={{
																marginTop: 30,
																fontWeight: 500,
																fontSize: '1.2rem',
															}}
														>
															{token &&
																token.user &&
																`Welcome back, ${token.user.firstName}!`}
														</Typography>

														<Typography
															color="primary"
															variant="subtitle1"
															style={{
																marginTop: 30,
																fontWeight: 500,
																fontSize: '0.9rem',
																textAlign: 'center',
															}}
														>
															{token &&
																token.user &&
																`Ship To, ${store.address}`}
														</Typography>
														<NoSsr>
															<Elements
																stripe={getStripe()}
																options={{
																	fonts: [
																		{
																			cssSrc:
																				'https://fonts.googleapis.com/css?family=Poppins',
																		},
																	],
																}}
															/>
														</NoSsr>
													</>
												)) || (
													<>
														<Typography
															color="primary"
															variant="subtitle1"
															style={{
																marginTop: 30,
																fontWeight: 500,
																fontSize: '1.2rem',
															}}
														>
															Upload a Picture of Your ID
														</Typography>
														<Typography
															color="textPrimary"
															variant="subtitle2"
															style={{
																fontWeight: 500,
																marginTop: 5,
																fontSize: '0.9rem',
																textAlign: 'center',
															}}
														>
															{`In order to continue to checkout we use your ID to ensure you are ${'21'} years of age and aren't someone else.`}
														</Typography>
														<div
															style={{
																marginTop: 40,
																paddingLeft: 60,
																paddingRight: 60,
															}}
														>
															<DropzoneArea
																acceptedFiles={['image/*']}
																dropzoneText="Drag and drop an image here or click"
																onChange={(files) => {
																	if (files && files[0]) {
																		blobToBase64(files[0]).then((res) => {
																			setPicture(res);
																		});
																	}
																}}
																filesLimit={1}
																maxFileSize={5000000}
															/>
														</div>
														<div
															style={{
																paddingLeft: '10%',
																paddingRight: '10%',
																minHeight: 60,
																display: 'flex',
																marginTop: 15,
																width: (loading && 'fit-content') || '100%',
															}}
														>
															{(loading && (
																<CircularProgress size={45} color="primary" />
															)) || (
																<Button
																	variant="contained"
																	color="primary"
																	size="large"
																	disableElevation
																	fullWidth
																	onClick={() => {
																		setLoading(true);

																		setError('');

																		fetch(
																			`${
																				(USE_LOCAL_HOST &&
																					'http://localhost:3000') ||
																				'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
																			}/dev/uploadID`,
																			{
																				headers: {
																					'Content-Type': 'application/json',
																					authToken: store.authToken,
																				},

																				method: 'PUT',
																				// @ts-ignore
																				body: JSON.stringify({
																					id: picture,
																				}),
																			}
																		)
																			.then((res: any) => res.json())
																			.then((json: any) => {
																				setLoading(false);

																				if (json.success) {
																					store.setAuthToken(json.token);
																				} else {
																					setError(json.reason);
																				}

																				if (json.clearToken) {
																					store.setCreationCode('');
																				}
																			});
																	}}
																	style={{
																		borderRadius: 10,
																		fontSize: '1rem',
																		fontWeight: 600,
																		padding: 15,
																	}}
																	disabled={!picture}
																>
																	Upload Your ID
																</Button>
															)}
														</div>
													</>
												)}
											</>
										)) || (
											<>
												{(store.creationCode !== '' && (
													<>
														<Typography
															color="primary"
															variant="subtitle1"
															style={{
																marginTop: 30,
																fontWeight: 500,
																fontSize: '1.2rem',
															}}
														>
															Create an Account
														</Typography>

														<Grid container spacing={3} style={{ padding: 10 }}>
															<Grid item xs={12}>
																<TextField
																	value={firstName}
																	onChange={(e: any) => {
																		setFirstName(e.target.value);
																	}}
																	variant="standard"
																	fullWidth
																	label="First Name"
																	autoCapitalize="words"
																	autoComplete="given-name"
																	inputProps={{
																		style: { textAlign: 'center' },
																	}}
																/>
															</Grid>
															<Grid item xs={12}>
																<TextField
																	value={lastName}
																	onChange={(e: any) => {
																		setLastName(e.target.value);
																	}}
																	variant="standard"
																	fullWidth
																	label="Last Name"
																	autoCapitalize="words"
																	autoComplete="family-name"
																	inputProps={{
																		style: { textAlign: 'center' },
																	}}
																/>
															</Grid>

															<Grid item xs={12}>
																<KeyboardDatePicker
																	disableToolbar
																	variant="inline"
																	format="MM/dd/yyyy"
																	margin="normal"
																	id="date-picker-inline"
																	label="Birthday"
																	fullWidth
																	value={birthday}
																	onChange={handleBirthday}
																	KeyboardButtonProps={{
																		'aria-label': 'change date',
																	}}
																/>
															</Grid>

															<Grid item xs={12}>
																<FormControlLabel
																	value="end"
																	control={
																		<Checkbox
																			color="primary"
																			checked={accepted}
																			onChange={(e) => {
																				setAccepted(e.target.checked);
																			}}
																		/>
																	}
																	label={
																		<Typography
																			variant="subtitle2"
																			style={{
																				textAlign: 'justify',
																				fontSize: '0.8rem',
																			}}
																		>
																			{`I confirm that I have read, consent and
																			agree to Sheesha${"'"}s User Agreement and
																			Privacy Policy, and I am of legal age to
																			purchase Tobacco products in my state.`}
																		</Typography>
																	}
																	labelPlacement="end"
																/>
															</Grid>
														</Grid>
														<div
															style={{
																paddingLeft: '10%',
																paddingRight: '10%',
																minHeight: 60,
																display: 'flex',
																marginTop: 15,
															}}
														>
															{(loading && (
																<CircularProgress size={45} color="primary" />
															)) || (
																<Button
																	variant="contained"
																	color="primary"
																	size="large"
																	disableElevation
																	fullWidth
																	onClick={() => {
																		setLoading(true);

																		setError('');

																		fetch(
																			`${
																				(USE_LOCAL_HOST &&
																					'http://localhost:3000') ||
																				'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
																			}/dev/signUp`,
																			{
																				headers: {
																					'Content-Type': 'application/json',
																				},

																				method: 'POST',
																				// @ts-ignore
																				body: JSON.stringify({
																					token: store.creationCode,
																					firstName,
																					lastName,
																					birthday,
																					acceptTerms: accepted,
																				}),
																			}
																		)
																			.then((res: any) => res.json())
																			.then((json: any) => {
																				setLoading(false);

																				console.log(json);

																				if (json.success) {
																					store.setAuthToken(json.token);
																				} else {
																					setError(json.reason);
																				}

																				if (json.clearToken) {
																					store.setCreationCode('');
																				}
																			});
																	}}
																	style={{
																		borderRadius: 10,
																		fontSize: '1rem',
																		fontWeight: 600,
																		padding: 15,
																	}}
																	disabled={
																		firstName.length < 1 ||
																		lastName.length < 1 ||
																		birthday === null ||
																		!accepted
																	}
																>
																	Create Your Account
																</Button>
															)}
														</div>
														<Typography
															color="error"
															variant="subtitle2"
															style={{
																fontWeight: 500,
																marginTop: 10,
																fontSize: '1.1rem',
																textAlign: 'center',
															}}
														>
															{error}
														</Typography>
													</>
												)) || (
													<>
														{(sentText && (
															<>
																<Typography
																	color="primary"
																	variant="subtitle1"
																	style={{
																		marginTop: 30,
																		fontWeight: 500,
																		fontSize: '1.2rem',
																	}}
																>
																	Enter Your Verification Code
																</Typography>
																<Typography
																	color="textPrimary"
																	variant="subtitle2"
																	style={{
																		fontWeight: 500,
																		marginTop: 5,
																		fontSize: '0.9rem',
																		textAlign: 'center',
																	}}
																>
																	{`We sent a verification code to ${phoneNumber}. Please Enter it Below.`}
																</Typography>
																<div
																	style={{
																		display: 'flex',
																		alignContent: 'center',
																		justifyContent: 'center',
																		alignItems: 'center',
																		marginTop: 50,
																		marginBottom: 50,
																	}}
																>
																	{/* {[0, 1, 2, 3].map((_, index) => {
										return (
											<div style={{ maxWidth: 100, paddingRight: '5%' }}>
												<TextField
													value={verificationCode[index]}
													onChange={(e: any) => {
														e.persist();

														setVerificationCode((val: string) => {
															alert(index);
															const newval = val.split();
															newval[index] = e.target.value;
															return newval.join('');
														});
													}}
													inputProps={{
														style: { textAlign: 'center', fontSize: '1.2rem' },
													}}
												/>
											</div>
										);
									})} */}
																	<div className="custom-styles">
																		<NoSsr>
																			<ReactInputVerificationCode
																				onChange={(val) => {
																					setVerificationCode(val);
																				}}
																				value={verificationCode}
																				placeholder=""
																			/>
																		</NoSsr>
																	</div>
																</div>
																<div
																	style={{
																		paddingLeft: '10%',
																		paddingRight: '10%',
																		minHeight: 60,
																		display: 'flex',
																	}}
																>
																	{(loading && (
																		<CircularProgress
																			size={45}
																			color="primary"
																		/>
																	)) || (
																		<Button
																			variant="contained"
																			color="primary"
																			size="large"
																			disableElevation
																			fullWidth
																			onClick={() => {
																				setLoading(true);
																				setError('');

																				fetch(
																					`${
																						(USE_LOCAL_HOST &&
																							'http://localhost:3000') ||
																						'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
																					}/dev/verify`,
																					{
																						headers: {
																							'Content-Type':
																								'application/json',
																						},

																						method: 'POST',
																						// @ts-ignore
																						body: JSON.stringify({
																							phoneNumber: `+1${phoneNumber.replace(
																								/\D/g,
																								''
																							)}`,
																							code: verificationCode,
																						}),
																					}
																				)
																					.then((res: any) => res.json())
																					.then((json: any) => {
																						setLoading(false);

																						console.log(json);
																						// setSentText(json.status === 'pending');
																						// alert(JSON.stringify(json));

																						if (json.valid) {
																							if (json.hasAccount) {
																								store.setAuthToken(json.token);
																							} else {
																								store.setCreationCode(
																									json.token
																								);
																							}
																						} else {
																							setError(
																								`You've entered an invalid code!`
																							);
																						}
																					});
																			}}
																			style={{
																				borderRadius: 10,
																				fontSize: '1rem',
																				fontWeight: 600,
																				padding: 15,
																			}}
																			disabled={verificationCode.length < 4}
																		>
																			Verify Phone Number
																		</Button>
																	)}
																</div>
																<Typography
																	color="error"
																	variant="subtitle2"
																	style={{
																		fontWeight: 500,
																		marginTop: 10,
																		fontSize: '1.1rem',
																		textAlign: 'center',
																	}}
																>
																	{error}
																</Typography>
															</>
														)) || (
															<>
																<Typography
																	color="primary"
																	variant="subtitle1"
																	style={{
																		marginTop: 30,
																		fontWeight: 500,
																		fontSize: '1.2rem',
																	}}
																>
																	Enter Your Phone Number
																</Typography>

																<Typography
																	color="textPrimary"
																	variant="subtitle2"
																	style={{
																		fontWeight: 500,
																		marginTop: 5,
																		fontSize: '1rem',
																	}}
																>
																	Verify Your Account
																</Typography>

																<div
																	style={{
																		paddingLeft: '10%',
																		paddingRight: '10%',
																	}}
																>
																	<TextField
																		required
																		name="phoneNumber"
																		value={phoneNumber}
																		onChange={(e: any) => {
																			setPhoneNumber(e.target.value);
																		}}
																		// onBlur={handleBlur}
																		style={{
																			marginTop: 50,
																			marginBottom: 75,
																		}}
																		autoComplete="tel-national"
																		type="tel"
																		InputProps={{
																			autoComplete: 'tel-national',
																			startAdornment: (
																				<Typography
																					variant="button"
																					style={{
																						fontSize: '1.3rem',
																						fontWeight: 700,
																						textAlign: 'left',
																					}}
																				>
																					+1
																				</Typography>
																			),
																			inputComponent: TextMaskCustom as any,
																		}}
																	/>
																</div>

																<div
																	style={{
																		paddingLeft: '10%',
																		paddingRight: '10%',
																		minHeight: 60,
																	}}
																>
																	{(loading && (
																		<CircularProgress
																			size={45}
																			color="primary"
																		/>
																	)) || (
																		<Button
																			variant="contained"
																			color="primary"
																			size="large"
																			disableElevation
																			fullWidth
																			onClick={() => {
																				setLoading(true);
																				setError('');
																				fetch(
																					`${
																						(USE_LOCAL_HOST &&
																							'http://localhost:3000') ||
																						'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
																					}/dev/login`,
																					{
																						headers: {
																							'Content-Type':
																								'application/json',
																						},

																						method: 'POST',
																						// @ts-ignore
																						body: JSON.stringify({
																							phoneNumber: `+1${phoneNumber.replace(
																								/\D/g,
																								''
																							)}`,
																						}),
																					}
																				)
																					.then((res: any) => res.json())
																					.then((json: any) => {
																						setSID(json.sid);
																						setLoading(false);
																						setSentText(
																							json.status === 'pending'
																						);
																					});
																			}}
																			style={{
																				borderRadius: 10,
																				fontSize: '1rem',
																				fontWeight: 600,
																				padding: 15,
																			}}
																			disabled={
																				phoneNumber.replace(/\D/g, '').length <
																				10
																			}
																		>
																			Send Verification Code
																		</Button>
																	)}
																</div>
																<Typography
																	color="error"
																	variant="subtitle2"
																	style={{
																		fontWeight: 500,
																		marginTop: 10,
																		fontSize: '1.1rem',
																		textAlign: 'center',
																	}}
																>
																	{error}
																</Typography>
															</>
														)}
													</>
												)}
											</>
										)}
									</>
								)) || (
									<CircularProgress
										color="primary"
										size={80}
										style={{ marginTop: 100, marginBottom: 100 }}
									/>
								)}
							</Paper>
						</div>
					</>
				)) || (
					<>
						<Layout>
							<Grid
								container
								spacing={3}
								style={{
									justifyContent: 'center',
								}}
							>
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
												Delivery Time
											</Typography>
											<Select
												variant="standard"
												disableUnderline
												style={{
													borderRadius: 12,
													border: '1px solid rgba(0, 0, 0, 0.12)',
													boxShadow: 'none',
													backgroundColor: 'transparent !important',
												}}
												autoWidth
												SelectDisplayProps={{
													style: {
														padding: 15,
														paddingRight: 40,
														fontSize: '1rem',
														fontWeight: 600,
														color: 'rgb(40, 40, 40)',
													},
												}}
												MenuProps={{
													MenuListProps: {
														style: {
															backgroundColor: 'white',
															borderRadius: 24,
														},
													},
													PaperProps: {
														style: {
															backgroundColor: 'white',
															boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.08)',
															borderRadius: 24,
														},
													},
												}}
												value="ASAP (45 mins)"
											>
												<MenuItem
													value="ASAP (45 mins)"
													style={{ backgroundColor: 'transparent' }}
												>
													ASAP (45 mins)
												</MenuItem>
												<MenuItem value={20}>Twenty</MenuItem>
												<MenuItem value={30}>Thirty</MenuItem>
											</Select>
										</ListItem>
										<Divider />
										<ListItem
											style={{
												padding: 20,
												flexDirection: 'column',
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
												gutterBottom
												style={{
													fontWeight: 600,
													fontSize: '1rem',
													width: '100%',
												}}
											>
												Drop Off Address
											</Typography>
											<Typography
												color="textSecondary"
												variant="subtitle1"
												style={{
													fontWeight: 500,
													fontSize: '1rem',
													width: '100%',
												}}
											>
												{store.address}
											</Typography>
										</ListItem>
										<Divider />
										<ListItem
											style={{ padding: 20 }}
											// @ts-ignore
											button={!showChangeNumber}
											onClick={() => {
												if (!showChangeNumber) {
													setShowChangeNumber(true);
												}
											}}
										>
											{(showChangeNumber && (
												<div style={{ flexDirection: 'column' }}>
													<TextField
														required
														name="phoneNumber"
														value={contactNumber}
														onChange={(e: any) => {
															setContactNumber(e.target.value);
														}}
														// onBlur={handleBlur}
														style={{}}
														autoComplete="tel-national"
														type="tel"
														InputProps={{
															autoComplete: 'tel-national',
															startAdornment: (
																<Typography
																	variant="button"
																	style={{
																		fontSize: '1.3rem',
																		fontWeight: 700,
																		textAlign: 'left',
																	}}
																>
																	+1
																</Typography>
															),
															inputComponent: TextMaskCustom as any,
														}}
													/>
													<Button
														variant="contained"
														color="primary"
														disableElevation
														fullWidth
														onClick={() => {
															setShowChangeNumber(false);
														}}
														style={{
															marginTop: 10,
															borderRadius: 10,
														}}
														disabled={
															contactNumber.replace(/\D/g, '').length < 10
														}
													>
														Save
													</Button>
												</div>
											)) || (
												<>
													<ListItemText
														primary={
															<Typography
																color="textPrimary"
																variant="subtitle1"
																gutterBottom
																style={{
																	fontWeight: 600,
																	fontSize: '1rem',
																	width: '100%',
																}}
															>
																Contact Phone Number
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
																{(contactNumber &&
																	formatPhoneNumber(contactNumber)) ||
																	formatPhoneNumber(
																		token.user.phoneNumber.replace('+1', '')
																	)}
															</Typography>
														}
													/>
													<ListItemSecondaryAction>
														<Edit color="primary" />
													</ListItemSecondaryAction>
												</>
											)}
										</ListItem>
										<Divider />
										<ListItem
											style={{
												padding: 20,
												alignContent: 'center',
												width: '100%',
												alignItems: 'center',
												justifyItems: 'center',
												justifyContent: 'center',
												flexDirection: 'column',
											}}
										>
											{showChangeAddress && (
												<LocationInput
													style={{
														borderRadius: 10,
														boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.1)',
													}}
													clickOverride={() => {
														setShowChangeAddress(false);
													}}
												/>
											)}
											<Button
												variant="outlined"
												color={(showChangeAddress && 'secondary') || 'primary'}
												disableElevation
												onClick={() => {
													setShowChangeAddress(!showChangeAddress);
												}}
												startIcon={<EditLocation />}
												style={{
													marginTop: 20,
													borderRadius: 20,
													fontSize: '1rem',
													fontWeight: 500,
													padding: 15,
													paddingLeft: 40,
													paddingRight: 40,
													textTransform: 'none',
												}}
											>
												{(showChangeAddress && 'Cancel') || 'Change Location'}
											</Button>
											<Typography
												color="textSecondary"
												variant="subtitle1"
												style={{
													fontWeight: 500,
													fontSize: '0.9rem',
													width: '100%',
													textAlign: 'center',
													marginTop: 25,
													color: 'rgba(37, 37, 37, 0.5)',
												}}
											>
												* Please remember that our driver must see the ID
												attached to your account in order to hand over your
												products.
											</Typography>
										</ListItem>
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
											<Button
												variant="contained"
												color="primary"
												size="large"
												disableElevation
												style={{
													borderRadius: 10,
												}}
												href="/items"
												startIcon={<AddCircleOutline />}
											>
												Add More Items
											</Button>
										</ListItem>
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
																{order.Quantity}
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
																		{(
																			order.Quantity * addon.Price
																		).toLocaleString('en-US', {
																			style: 'currency',
																			currency: 'USD',
																		})}
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
																	{(
																		order.Quantity * order.Price
																	).toLocaleString('en-US', {
																		style: 'currency',
																		currency: 'USD',
																	})}
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
										</div>
									</List>
								</Grid>

								<Grid
									item
									xs={12}
									md={5}
									style={{
										alignSelf: 'flex-start',
										alignItems: 'center',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<Typography
										color="textPrimary"
										variant="subtitle1"
										style={{
											marginTop: 20,
											fontWeight: 600,
											fontSize: '1.4rem',
											width: '100%',
										}}
									>
										Billing Information
									</Typography>

									{((token.user.card || cardInfo.last4) &&
										!showChangeCard && (
											<>
												<div
													style={{
														marginTop: 15,
														borderRadius: 20,
														padding: 20,
														width: '95%',
														backgroundColor: '#FC510D',
														height: 200,
														position: 'relative',
														overflow: 'hidden',
														maxWidth: 350,
													}}
												>
													<>
														<div
															style={{
																width: 140,
																height: 140,
																position: 'absolute',
																top: -60,
																left: -20,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>
														<div
															style={{
																width: 40,
																height: 40,
																position: 'absolute',
																bottom: 40,
																left: -20,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>
														<div
															style={{
																width: 50,
																height: 50,
																position: 'absolute',
																top: -25,
																right: 100,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>

														<div
															style={{
																width: 90,
																height: 90,
																position: 'absolute',
																top: -40,
																right: -40,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>

														<div
															style={{
																width: 50,
																height: 50,
																position: 'absolute',
																top: 95,
																right: -30,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>

														<div
															style={{
																width: 80,
																height: 80,
																position: 'absolute',
																bottom: -45,
																right: 80,
																borderRadius: 100,
																backgroundColor: '#FE6528',
																zIndex: 1,
															}}
														/>
													</>
													<Typography
														style={{
															color: 'white',
															fontWeight: 500,
															fontSize: '1.2rem',
															position: 'absolute',
															zIndex: 10,
														}}
													>
														{cardInfo.name ||
															(token.user &&
																token.user.card &&
																token.user.card.name)}
													</Typography>

													<Typography
														style={{
															color: 'white',
															fontWeight: 500,
															fontSize: '1.2rem',
															position: 'absolute',
															bottom: 20,
															zIndex: 3,
														}}
													>
														{`•••• •••• •••• ${
															cardInfo.last4 ||
															(token.user &&
																token.user.card &&
																token.user.card.last4)
														}`}
													</Typography>

													{(cardBrand === 'visa' && (
														<Cards.Visa
															width={60}
															height={60}
															fill="white"
															style={{
																position: 'absolute',
																bottom: 5,
																right: 20,
															}}
														/>
													)) ||
														(cardBrand === 'amex' && (
															<Cards.Amex
																width={60}
																height={60}
																fill="white"
																style={{
																	position: 'absolute',
																	bottom: 5,
																	right: 20,
																}}
															/>
														)) ||
														(cardBrand === 'discover' && (
															<Cards.Discover
																width={60}
																height={60}
																fill="white"
																style={{
																	position: 'absolute',
																	bottom: 5,
																	right: 20,
																}}
															/>
														)) ||
														(cardBrand === 'mastercard' && (
															<Cards.MasterCard
																width={60}
																height={60}
																fill="white"
																style={{
																	position: 'absolute',
																	bottom: 5,
																	right: 20,
																}}
															/>
														))}
												</div>

												<div style={{ paddingLeft: '5%', paddingRight: '5%' }}>
													<Button
														variant="outlined"
														color="primary"
														size="large"
														fullWidth
														disableElevation
														onClick={() => {
															setShowChangeCard(!showChangeCard);
														}}
														startIcon={<CreditCard />}
														style={{
															marginTop: 25,
															borderRadius: 20,
															fontSize: '1.1rem',
															fontWeight: 600,
															padding: 15,
															paddingLeft: 40,
															paddingRight: 40,
															textTransform: 'none',
															borderStyle: 'dashed',
															borderWidth: 1.5,
															marginBottom: 25,
														}}
													>
														Change Your Card
													</Button>
												</div>
											</>
										)) || (
										<div
											style={{
												marginTop: 15,
												boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.1)',
												borderRadius: 24,
												border: '1px solid rgba(213, 213, 213, 0.33)',
												justifyContent: 'center',
												alignItems: 'center',
												justifyItems: 'center',
												alignContent: 'center',
												padding: 20,
												width: '100%',
											}}
										>
											<NoSsr>
												<Elements
													stripe={getStripe()}
													options={{
														fonts: [
															{
																cssSrc:
																	'https://fonts.googleapis.com/css?family=Poppins',
															},
														],
													}}
												>
													<CheckoutForm
														onPaymentMethod={(paymentMethod: any) => {
															setShowChangeCard(false);
															setCardInfo({
																id: paymentMethod.id,
																brand: paymentMethod.card.brand,
																last4: paymentMethod.card.last4,
																exp_year: paymentMethod.card.exp_year,
																exp_month: paymentMethod.card.exp_month,
																funding: paymentMethod.card.funding,
																name: paymentMethod.billing_details.name,
															});
														}}
														phoneNumber={token.user.phoneNumber}
													/>
												</Elements>
											</NoSsr>
										</div>
									)}
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
												{`Driver's Tip${''}`}
											</Typography>
											<ButtonGroup
												color="primary"
												disableElevation
												disableRipple
											>
												{POSSIBLE_DRIVER_TIPS.map((val) => (
													<Button
														style={{ borderWidth: 1 }}
														variant={
															(selectedDriverTip === val && 'contained') ||
															'outlined'
														}
														onClick={() => {
															setSelectedDriverTip(val);
														}}
													>
														${Math.floor(total * val)}
													</Button>
												))}
											</ButtonGroup>
										</ListItem>
										<Divider />
										<div
											style={{
												marginTop: 20,
												marginBottom: 30,
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
														fontSize: '1rem',
														fontWeight: 500,
														textTransform: 'none',
													}}
												>
													Additional Notes
												</Typography>
												<TextField
													onChange={(e: any) => {
														setNotes(e.target.value);
													}}
													multiline
													fullWidth
													variant="outlined"
													rows={10}
													style={{ borderRadius: 20, marginTop: 10 }}
												/>
											</div>
										</div>
									</List>
								</Grid>

								<Grid
									item
									xs={12}
									style={{
										display: 'flex',
										width: '100%',
										alignContent: 'center',
										justifyContent: 'center',
										alignItems: 'center',
										justifyItems: 'center',
									}}
								>
									<Elements
										stripe={getStripe()}
										options={{
											fonts: [
												{
													cssSrc:
														'https://fonts.googleapis.com/css?family=Poppins',
												},
											],
										}}
									>
										{(loading && (
											<CircularProgress color="primary" size={80} />
										)) || (
											<Button
												variant="contained"
												color="primary"
												size="large"
												disableElevation
												fullWidth
												disabled={
													(!cardInfo &&
														!cardInfo.last4 &&
														!token &&
														!token.user &&
														!token.user.card &&
														!token.user.card.last4) ||
													showChangeCard
												}
												style={{
													borderRadius: 10,
													fontSize: '1rem',
													fontWeight: 600,
													padding: 15,
												}}
												onClick={() => {
													const items = store.items.map((item: any) => {
														return {
															Flavors: item.Flavors,
															Name: item.Name,
															Quantity: item.Quantity,
															Price: item.Price,
															Addons: item.Addons,
														};
													});
													setLoading(true);

													// const translatedCard = JSON.parse(
													// 	JSON.stringify({ ...token.user.card })
													// );
													// translatedCard.id = token.user.card.paymentId;

													fetch(
														`${
															(USE_LOCAL_HOST && 'http://localhost:3000') ||
															'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
														}/dev/submitOrder`,
														{
															headers: {
																'Content-Type': 'application/json',
																authToken: store.authToken,
															},

															method: 'POST',
															body: JSON.stringify({
																items,
																info: {
																	address: store.address,
																	dropOffTime: new Date(
																		new Date().getTime() + 1000 * 60 * 45
																	).getTime(),
																	contactNumber:
																		(contactNumber &&
																			formatPhoneNumber(contactNumber)) ||
																		formatPhoneNumber(
																			token.user.phoneNumber.replace('+1', '')
																		),
																	driverTip: Math.floor(
																		selectedDriverTip * total
																	),
																	notes,
																},
																card: (cardInfo && cardInfo.id && cardInfo) || {
																	...token.user.card,
																	id: token.user.card.paymentId,
																},
															}),
														}
													)
														.then((res: any) => res.json())
														.then(async (json: any) => {
															// if (json.success) {
															// 	store.setAuthToken(json.token);
															// }
															// if (json.clearToken) {
															// 	store.setAuthToken('');
															// }
															store.setAuthToken(json.token);
															const stripee = await getStripe();

															if (json.success) {
																setLoading(false);
																setUsedQuery(true);
																store.items = [];
																router.push({
																	pathname: '/trackOrder',
																	query: {
																		id: json.orderId,
																	},
																});
															} else if (json.error) {
																setLoading(false);
																alert(`${json.error}`);
																// setCardInfo({});
																setShowChangeCard(true);
															} else if (stripee !== null) {
																stripee
																	.handleCardAction(json.clientSecret)
																	.then((data) => {
																		if (data.error) {
																			setLoading(false);
																			alert(
																				`${data.error.message} ERRCOD:${data.error.decline_code}`
																			);
																			// setCardInfo({});
																			setShowChangeCard(true);
																		} else if (
																			data.paymentIntent.status ===
																			'requires_confirmation'
																		) {
																			fetch(
																				`${
																					(USE_LOCAL_HOST &&
																						'http://localhost:3000') ||
																					'https://5rt9fhw2qb.execute-api.us-east-1.amazonaws.com'
																				}/dev/submitOrder`,
																				{
																					headers: {
																						'Content-Type': 'application/json',
																						authToken: store.authToken,
																					},

																					method: 'POST',
																					body: JSON.stringify({
																						paymentIntentId:
																							data.paymentIntent.id,
																					}),
																				}
																			)
																				.then((result) => {
																					return result.json();
																				})
																				.then((json) => {
																					if (json.error) {
																						alert(json.error);
																					} else {
																						router.push({
																							pathname: '/trackOrder',
																							query: {
																								id: json.orderId,
																							},
																						});
																					}
																				});
																		}
																	});
															}
														});
												}}
											>
												Place Order
											</Button>
										)}
									</Elements>
								</Grid>
								{/* <Grid item xs={12}>
									<a
										href="sms:+12676945129"
										style={{
											textDecorationColor: 'transparent',
										}}
									>
										<Button
											fullWidth
											variant="contained"
											color="primary"
											disableElevation
											style={{
												borderRadius: 10,
												fontSize: '1rem',
												fontWeight: 600,
												padding: 15,
											}}
										>
											Contact Your Driver
										</Button>
									</a>
								</Grid> */}
							</Grid>
						</Layout>
					</>
				)}
			</>
		);
	})
);

export default index;
