import * as React from 'react';
import { useEffect, useState } from 'react';
import { createBkashButton, initBkash, triggerBkash } from './utils/initBkash';
import { IExecutePaymentResponse, IProps } from './utils/interfaces';
import { loadScript } from './utils/loadScript';

const jqueryURL = 'https://code.jquery.com/jquery-3.3.1.min.js';
const bkashURL = process.env.BKASH_URL || 'https://scripts.sandbox.bka.sh/versions/1.1.0-beta/checkout/bKash-checkout-sandbox.js';

function myCallBack(success: boolean, paymentInfo?: IExecutePaymentResponse) {
	success ? alert(paymentInfo?.trxID) : alert('payment failed');
	window.location.reload();
}

const BkashButton: React.FC<IProps> = ({
	btnText,
	amount,
	createPaymentURL,
	executePaymentURL,
	callBack,
	additionalHeaders = {},
}: IProps): JSX.Element => {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		async function main() {
			if (!isLoaded) {
				await loadScript(jqueryURL, 'jquery');
				createBkashButton();
				await loadScript(bkashURL, 'bkashScript');
				initBkash(amount, createPaymentURL, executePaymentURL, callBack || myCallBack, additionalHeaders);
				setIsLoaded(true);
			}
		}
		main();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<button disabled={!isLoaded} onClick={triggerBkash}>
			{btnText}
		</button>
	);
};

export default BkashButton;
