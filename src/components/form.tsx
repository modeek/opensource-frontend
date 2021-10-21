import {
	Button,
	Slide,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';

// @ts-ignore
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import React from 'react';
import { TransitionProps } from 'react-transition-group/Transition';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children?: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export interface ConfirmationDialogRawProps {
	classes: Record<'paper', string>;
	id: string;
	keepMounted: boolean;
	value?: string;
	employee?: any;
	open: boolean;
	onClose: (value?: string) => void;
	onOkay: (val?: any, emp?: any) => void;
}

export default function ConfirmationDialogRaw(
	props: ConfirmationDialogRawProps
) {
	const { onClose, value: valueProp, open, onOkay, employee, ...other } = props;
	const [value, setValue] = React.useState(valueProp);
	const radioGroupRef = React.useRef<HTMLElement>(null);

	React.useEffect(() => {
		setValue((employee && employee.PaycheckAmount) || 0);
	}, [open, employee]);

	const handleEntering = () => {
		if (radioGroupRef.current != null) {
			radioGroupRef.current.focus();
		}
	};

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onOkay(value, employee);
		onClose();
	};

	//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	//     setValue((event.target as HTMLInputElement).value);
	//   };

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="sm"
			onEntering={handleEntering}
			aria-labelledby="confirmation-dialog-title"
			open={open}
			// @ts-ignore
			TransitionComponent={Transition}
			{...other}
		>
			<DialogTitle id="confirmation-dialog-title">
				{`Change ${(employee && employee.firstName) || ''}'s Paycheck Amount`}
			</DialogTitle>
			<DialogContent dividers>
				<CurrencyTextField
					fullWidth
					label="Total Paycheck Amount"
					onChange={(_: any, value: any) => setValue(value)}
					value={value || ''}
				/>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button onClick={handleOk} color="primary">
					Save new Paycheck
				</Button>
			</DialogActions>
		</Dialog>
	);
}
