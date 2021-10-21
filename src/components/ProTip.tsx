import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			margin: theme.spacing(6, 0, 3),
		},
		lightBulb: {
			verticalAlign: 'middle',
			marginRight: theme.spacing(1),
		},
	})
);

export default function ProTip() {
	const classes = useStyles();
	return (
		<Typography className={classes.root} color="textSecondary">
			Pro tip: See more{' '}
			<Link href="https://material-ui.com/getting-started/templates/">
				templates
			</Link>{' '}
			on the Material-UI documentation.
		</Typography>
	);
}
