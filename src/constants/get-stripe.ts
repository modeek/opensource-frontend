import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(
			'pk_test_51IWoyGDkVpWDtdClUjuqog0Vm6Ndc4F78LTCxyiHB6wNtyl67irvIBi3dJRGDUWv9n8FIxZbY4oXgRunR3PQQdPX004KOVFur1'
			// 'pk_test_51IUX2BC3ebCblitDwuQUDEMztsSlYU1mZP7wzWWz4m0sq80Zm1feKXGVG4Z5kiUVC6ULMgIjnqMF5lU4ScCcC0fI00rDKfvNi1'
		);
	}
	return stripePromise;
};

export default getStripe;
