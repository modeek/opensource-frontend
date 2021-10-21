import React from 'react';
import {
	Button,
	Grid,
	NoSsr,
	Typography,
	Card,
	TextField,
	Popper,
	Paper,
	InputBase,
	List,
	ListItem,
	ListItemText,
	ClickAwayListener,
	IconButton,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl';

import { NavigateNext, LocationOn, Delete } from '@material-ui/icons';
import { NextPage } from 'next';

import { inject, observer } from 'mobx-react';
import Geocode from 'react-geocode';
import StoreIcon from '../src/components/StoreIcon';

import Layout from '../src/constants/Layout';
import Link from '../src/components/Link';

Geocode.setApiKey('AIzaSyAZgRxUwivhQa667FiBY8jYjsQ12EPbj1A');
Geocode.setLanguage('en');
Geocode.setRegion('en');
Geocode.enableDebug(true);

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(0),
		alignItems: 'center',
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(0),
			paddingRight: theme.spacing(0),
		},
	},

	searchButton: {
		height: 56,

		[theme.breakpoints.down('sm')]: {
			height: 42,
		},
	},
}));

const order: NextPage = inject('store')(
	observer((props: any) => {
		const { store } = props;

		const chosenAddress = store.address || {};

		console.log(chosenAddress.formatted_address);

		const setChosenAddress = (address: any) => {
			setDisableSearchBar(false);
			setAddressForSearch('');
			setTempMarker({
				longitude: null,
				latitude: null,
			});

			store.changeAddress(address);
		};

		const classes = useStyles();
		const [exactPos, setExactPos] = React.useState({
			latitude: 0,
			longitude: 0,
			altitude: 0,
		});

		const [mapPos, setMapPos] = React.useState({
			latitude: null,
			longitude: null,
		});

		const [useLocation, setUseLocation] = React.useState(false);

		const [addresses, setAddresses] = React.useState<any>([]);
		const [lastTime, setLastTime] = React.useState(new Date().getTime());

		const [addressForSearch, setAddressForSearch] = React.useState('');

		const [tempMarker, setTempMarker] = React.useState({
			latitude: null,
			longitude: null,
		});

		const [disableSearchBar, setDisableSearchBar] = React.useState(false);

		React.useEffect(() => {
			if (
				exactPos.longitude + exactPos.latitude + exactPos.altitude !== 0 &&
				new Date().getTime() - lastTime > 400
			) {
				setAddressForSearch('CURRENT LOCATION');
				setUseLocation(true);
				setMapPos({
					latitude: null,
					longitude: null,
				});
				setChosenAddress({});
				setLastTime(new Date().getTime());
				setDisableSearchBar(true);
				Geocode.fromLatLng(
					exactPos.latitude.toString(),
					exactPos.longitude.toString()
				)
					.then((response) => {
						setAddresses(
							response.results.filter(
								(address: any) =>
									address.types.findIndex(
										(b: any) =>
											b === 'street_address' ||
											b === 'establishment' ||
											b === 'point_of_interest' ||
											b === 'premise'
									) > -1
							)
						);
					})
					.catch((err) => console.log(err));
			}
		}, [exactPos]);

		React.useEffect(() => {
			if (
				new Date().getTime() - lastTime > 400 &&
				addressForSearch.length > 0
			) {
				setLastTime(new Date().getTime());
				Geocode.fromAddress(addressForSearch)
					.then((response) => {
						setAddresses(
							response.results.filter(
								(address: any) =>
									address.types.findIndex(
										(b: any) =>
											b === 'street_address' ||
											b === 'establishment' ||
											b === 'point_of_interest' ||
											b === 'premise'
									) > -1
							)
						);
					})
					.catch((err) => console.log(err));
			}
		}, [addressForSearch]);

		const searchBarRef = React.useRef<HTMLInputElement>();
		const searchBarInputRef = React.useRef<HTMLInputElement>();
		const mapCardRef = React.useRef<HTMLInputElement>();

		let updatedSize =
			(mapCardRef.current &&
				Math.min(650, mapCardRef.current.clientWidth * (10 / 9))) ||
			400;

		if (!(typeof window === 'undefined')) {
			updatedSize = Math.min(window.innerWidth * (5 / 6), 650);
		}

		const linkRef = React.useRef<HTMLAnchorElement>();

		return (
			<Layout>
				<Grid container className={classes.paper} spacing={3}>
					<Grid item xs={12} md={12}>
						<Paper
							style={{
								width: '100%',
								padding: 12,
							}}
							ref={searchBarRef}
						>
							<NoSsr>
								<InputBase
									disabled={
										disableSearchBar ||
										(addressForSearch === 'CURRENT LOCATION' &&
											exactPos.latitude !== 0)
									}
									fullWidth
									placeholder="Search For Address..."
									style={{
										minHeight: 48,
									}}
									onChange={(e: any) => {
										if (!chosenAddress.formatted_address) {
											setAddressForSearch(e.target.value);
										}
									}}
									inputRef={searchBarInputRef}
									value={chosenAddress.formatted_address || addressForSearch}
									startAdornment={<LocationOn />}
									endAdornment={
										chosenAddress.formatted_address && (
											<IconButton
												onClick={() => {
													setAddressForSearch('');
													setChosenAddress({});
												}}
											>
												<Delete />
											</IconButton>
										)
									}
									onKeyDown={(e: any) => {
										e.persist();
										const keyCode = e.which || e.keyCode;
										if (keyCode === 13 && !chosenAddress.formatted_address) {
											Geocode.fromAddress(addressForSearch)
												.then((response) => {
													setAddresses(
														response.results.filter(
															(address: any) =>
																address.types.findIndex(
																	(b: any) =>
																		b === 'street_address' ||
																		b === 'establishment' ||
																		b === 'point_of_interest' ||
																		b === 'premise'
																) > -1
														)
													);
												})
												.catch((err) => console.log(err));
										} else if (
											keyCode === 8 &&
											chosenAddress.formatted_address
										) {
											setAddressForSearch('');
											setChosenAddress({});
										}
									}}
								/>

								<Popper
									anchorEl={searchBarRef.current}
									open={addresses.length > 0}
									style={{
										borderTopRightRadius: 0,
										borderTopLeftRadius: 0,
										marginTop: -7,
										width: searchBarRef.current?.clientWidth,
									}}
									modifiers={{
										flip: {
											enabled: false,
										},
										preventOverflow: {
											enabled: true,
											boundariesElement: 'window',
										},
										arrow: {
											enabled: false,
										},
									}}
								>
									<ClickAwayListener
										onClickAway={() => {
											if (
												addresses.length > 0 &&
												new Date().getTime() - lastTime > 100
											) {
												if (addressForSearch === 'CURRENT LOCATION') {
													setAddressForSearch('');
												}
												if (useLocation) {
													console.log('woop');
													setUseLocation(false);
												}
												setAddresses([]);
												setDisableSearchBar(false);
												setExactPos({
													longitude: 0,
													latitude: 0,
													altitude: 0,
												});
											}
										}}
									>
										<Paper>
											<List>
												{addresses.map((address: any) => {
													return (
														<ListItem
															key={address.formatted_address}
															button
															onClick={() => {
																setChosenAddress(address);
																setUseLocation(false);
																setMapPos({
																	longitude: address.geometry.location.lng,
																	latitude: address.geometry.location.lat,
																});
																setAddresses([]);
															}}
															onMouseEnter={() => {
																setTempMarker({
																	longitude: address.geometry.location.lng,
																	latitude: address.geometry.location.lat,
																});
															}}
															onMouseLeave={() => {
																setTempMarker({
																	longitude: null,
																	latitude: null,
																});
															}}
														>
															<ListItemText
																primary={address.formatted_address}
															/>
														</ListItem>
													);
												})}
												{useLocation === true && (
													<ListItem
														button
														onClick={() => {
															setAddresses([]);
															setDisableSearchBar(false);
															setUseLocation(false);
															setExactPos({
																longitude: 0,
																latitude: 0,
																altitude: 0,
															});

															if (addressForSearch === 'CURRENT LOCATION') {
																setAddressForSearch('');
															}

															setTimeout(() => {
																if (searchBarInputRef.current) {
																	searchBarInputRef.current.focus();
																}
															}, 300);
														}}
													>
														<ListItemText
															primary="CURRENT ADDRESS NOT LISTED"
															primaryTypographyProps={{
																variant: 'button',
																color: 'error',
															}}
														/>
													</ListItem>
												)}
											</List>
										</Paper>
									</ClickAwayListener>
								</Popper>
							</NoSsr>
						</Paper>
					</Grid>

					<Grid item xs={12}>
						<NoSsr>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								// style={
								//   (chosenAddress.formatted_address && {
								//     backgroundColor: "#b23c17",
								//   }) ||
								//   {}
								// }
								disabled={chosenAddress.formatted_address}
								size="large"
								onClick={() => {
									if (!navigator.geolocation) {
										alert('Geolocation is not supported by your browser');
									} else {
										if (chosenAddress.formatted_address) {
											setChosenAddress({});
										}
										navigator.geolocation.getCurrentPosition((success: any) => {
											setExactPos({
												latitude: success.coords.latitude,
												longitude: success.coords.longitude,
												altitude: success.coords.altitude,
											});
										});
									}
								}}
							>
								Use My Current Location
							</Button>
						</NoSsr>
					</Grid>

					<Grid item xs={12} style={{}}>
						<NoSsr>
							<Card
								style={{
									overflow: 'hidden',
									width: '100%',
									padding: 0,
									height: updatedSize,
									borderRadius: 15,
									WebkitBorderRadius: 15,
									MozBorderRadius: 15,
								}}
								raised
								ref={mapCardRef}
							>
								<ReactMapGL
									style={{
										borderRadius: 15,
										WebkitBorderRadius: 15,
										MozBorderRadius: 15,
									}}
									mapStyle="mapbox://styles/mapbox/streets-v11"
									mapboxApiAccessToken="pk.eyJ1IjoibW9kZWVrIiwiYSI6ImNrYjE1OGdrYzBnaDIyc3BmODNoZnU2aGQifQ.1XiE3bbs8yZQsVhiV-ObsQ"
									latitude={
										mapPos.latitude ||
										(chosenAddress.geometry &&
											chosenAddress.geometry.location.lat) ||
										(exactPos.latitude !== 0 &&
											exactPos.longitude !== 0 &&
											exactPos.latitude) ||
										39.9526
									}
									dragPan={false}
									dragRotate={false}
									scrollZoom={false}
									doubleClickZoom={false}
									touchRotate={false}
									touchZoom={false}
									keyboard={false}
									touchAction="pan-y"
									longitude={
										mapPos.longitude ||
										(chosenAddress.geometry &&
											chosenAddress.geometry.location.lng) ||
										(exactPos.latitude !== 0 &&
											exactPos.longitude !== 0 &&
											exactPos.longitude) ||
										-75.1652
									}
									width="100%"
									height="100%"
									zoom={
										(((exactPos.latitude !== 0 && exactPos.longitude !== 0) ||
											mapPos.latitude ||
											chosenAddress.formatted_address) &&
											16) ||
										10
									}
								>
									{(chosenAddress.formatted_address && (
										<Marker
											latitude={
												(chosenAddress.geometry &&
													chosenAddress.geometry.location.lat) ||
												0
											}
											longitude={
												(chosenAddress.geometry &&
													chosenAddress.geometry.location.lng) ||
												0
											}
											offsetLeft={0}
											offsetTop={-50}
										>
											<StoreIcon
												style={{
													width: 50,
													height: 50,
												}}
											/>
										</Marker>
									)) || (
										<GeolocateControl
											positionOptions={{
												enableHighAccuracy: true,
											}}
											// trackUserLocation={true}
											style={{
												width: 0,
												height: 0,
												display: 'hidden',
												visibility: 'hidden',
											}}
											// @ts-ignore
											auto={useLocation}
											showUserLocation={useLocation}
											onGeolocate={(success: any) => {
												setExactPos({
													latitude: success.coords.latitude,
													longitude: success.coords.longitude,
													altitude: success.coords.altitude,
												});
											}}
										/>
									)}

									{tempMarker.latitude && (
										<Marker
											latitude={tempMarker.latitude || 0}
											longitude={tempMarker.longitude || 0}
											offsetLeft={0}
											offsetTop={-50}
										>
											<StoreIcon
												style={{
													width: 50,
													height: 50,
												}}
											/>
										</Marker>
									)}
								</ReactMapGL>
							</Card>
						</NoSsr>
					</Grid>

					<Grid item xs={12}>
						<Button
							fullWidth
							variant={
								(!chosenAddress.formatted_address && 'outlined') || 'contained'
							}
							disabled={!chosenAddress.formatted_address}
							color="primary"
							size="large"
							endIcon={<NavigateNext />}
							onClick={() => {
								linkRef.current?.click();
							}}
						>
							{/* @ts-ignore */}
							<Link href="/items" color="inherit" ref={linkRef}>
								Next
							</Link>
						</Button>
					</Grid>
				</Grid>
			</Layout>
		);
	})
);

export default order;
