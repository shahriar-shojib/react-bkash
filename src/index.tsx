import React, { ReactElement } from 'react';
import { useEffect, useState, FC, PropsWithChildren, cloneElement } from 'react';
import { createBkashButton, initBkash, triggerBkash } from './utils/initBkash';
import { IProps } from './utils/interfaces';
import { loadScript } from './utils/loadScript';

const BkashButton: FC<PropsWithChildren<IProps>> = ({
	onSuccess,
	onClose,
	children,
	config: { amount, bkashScriptURL, createPaymentURL, executePaymentURL, additionalHeaders },
}): JSX.Element => {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		async function main() {
			if (!isLoaded) {
				await loadScript('https://code.jquery.com/jquery-3.3.1.min.js', 'jquery');
				createBkashButton();
				await loadScript(bkashScriptURL, 'bkashScript');
				initBkash(amount, createPaymentURL, executePaymentURL, onSuccess, onClose, additionalHeaders);
				setIsLoaded(true);
			}
		}
		main();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLoaded) {
		return <div onClick={triggerBkash}>{cloneElement(children as ReactElement, { onClick: triggerBkash })}</div>;
	}

	return <></>;
};

export default BkashButton;
