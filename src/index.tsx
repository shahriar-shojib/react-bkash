import React, { ReactElement, useEffect, useState, FC, cloneElement } from 'react';
import { initBkash, triggerBkash, loadDeps, IProps } from './utils';

const BkashButton: FC<IProps> = (props): JSX.Element | null => {
	const [isLoaded, setLoaded] = useState(false);
	const {
		onSuccess,
		onClose,
		children,
		config: { amount, bkashScriptURL, createPaymentURL, executePaymentURL, additionalHeaders },
	} = props;

	useEffect(() => {
		async function main() {
			if (!isLoaded) {
				await loadDeps(bkashScriptURL);
				initBkash(amount, createPaymentURL, executePaymentURL, onSuccess, onClose, additionalHeaders);
				setLoaded(true);
			}
		}
		main();
	}, []);

	if (isLoaded) {
		return <div onClick={triggerBkash}>{cloneElement(children as ReactElement, { onClick: triggerBkash })}</div>;
	}

	return null;
};

export default BkashButton;
export * from './utils';
