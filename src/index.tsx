import React, {
	cloneElement,
	FC,
	isValidElement,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	useCallback,
	useState,
} from 'react';
import { BkashConfig } from './bkash';
import { useAsync } from './hooks/useAsync';
import {
	BkashComponentConfig,
	BkashSuccessFunction,
	ExecutePaymentResponse,
	ICreatePaymentResponse,
	isDefaultConfig,
	loadDependencies,
	post,
} from './utils';

export type BkashButtonProps = {
	onSuccess: BkashSuccessFunction;
	onClose: () => void;
	config: BkashComponentConfig;

	/**
	 * Use a custom function to render the error message.
	 * @param error The error message.
	 */
	renderError?: (error: Error) => JSX.Element | null;

	/**
	 * Show a custom loader when bkash is initiating
	 */
	loader?: ReactNode;
	/**
	 * @default false
	 */
	debug?: boolean;
	children: ReactNode;
};

const BKASH_BUTTON_ID = 'bKash_button';

export const BkashButton: FC<BkashButtonProps> = ({
	config,
	onClose,
	onSuccess,
	loader,
	children,
	renderError,
	debug = false,
}): JSX.Element | null => {
	const [paymentID, setPaymentID] = useState('');
	const [bkashNotfoundError, setBkashNotFoundError] = useState(false);
	const [paymentAPIError, setPaymentAPIError] = useState<Error | null>(null);
	const [bkashButtonError, setBkashButtonError] = useState<Error | null>(null);

	//create a hidden button on dom with bkash button id
	const createBkashButton = useCallback(() => {
		const button = document.createElement('button');
		button.style.display = 'none';
		button.id = BKASH_BUTTON_ID;
		const body = document.querySelector('body');
		if (body) {
			body.appendChild(button);
			return;
		}
	}, []);

	//click on bkash button
	const triggerBkash = useCallback((): void => {
		const createdButton = document.getElementById(BKASH_BUTTON_ID) as HTMLButtonElement;
		if (createdButton) {
			createdButton.click();
			createdButton.remove();
			return;
		}
		setBkashButtonError(new Error('Could not find bkash button on document'));
	}, []);

	//bkash iframe config
	const initBkash = useCallback(() => {
		const { amount } = config;
		const bkashConfig: BkashConfig = {
			paymentMode: 'checkout',
			paymentRequest: {
				amount: String(amount),
				intent: 'sale',
				currency: 'BDT',
			},

			createRequest: async (request) => {
				if (!isDefaultConfig(config)) {
					try {
						const result = await config.onCreatePayment(request);
						setPaymentID(result.paymentID);
						window.bKash.create().onSuccess(result);
					} catch (error) {
						setPaymentAPIError(error);
						window.bKash.create().onError();
					}
					return;
				}

				const result = await post<ICreatePaymentResponse>(
					config.createPaymentURL,
					request,
					config.additionalHeaders || {}
				);
				if (result.error !== null) {
					window.bKash.create().onError();
					setPaymentAPIError(result.error);
					return;
				}
				setPaymentID(result.data.paymentID);
				window.bKash.create().onSuccess(result.data);
			},

			executeRequestOnAuthorization: async () => {
				if (!isDefaultConfig(config)) {
					try {
						const result = await config.onExecutePayment(paymentID);
						onSuccess(result);
					} catch (error) {
						setPaymentAPIError(error);
						window.bKash.execute().onError();
					}
					return;
				}

				const result = await post<ExecutePaymentResponse>(
					config.executePaymentURL,
					{ paymentID },
					config.additionalHeaders || {}
				);

				if (result.error !== null) {
					setPaymentAPIError(result.error);
					window.bKash.execute().onError();
					return;
				}
				onSuccess(result.data);
			},

			onClose: () => onClose(),
		};

		if (!window.bKash) {
			setBkashNotFoundError(true);
			return;
		}

		if (window.bKash) {
			window.bKash.init(bkashConfig);
		}
	}, [config, onClose, onSuccess, paymentID]);

	// Load dependencies & setup bkash
	const initFunction = useCallback(async () => {
		if (debug) {
			console.log('[bKash] Initializing bKash');
		}

		createBkashButton();

		await loadDependencies(config.bkashScriptURL);
		initBkash();
		return true;
	}, [config.bkashScriptURL, createBkashButton, debug, initBkash]);

	const { loading, data, error } = useAsync(initFunction);

	/**
	 * Handler that clicks bkash button and also calls children's onClick handler if it exists
	 */
	const onClickHandler: MouseEventHandler<HTMLElement> = useCallback(
		(e) => {
			triggerBkash();
			if (isValidElement(children)) {
				children.props.onClick?.(e);
			}
		},
		[children, triggerBkash]
	);

	if (loading) {
		return (loader as JSX.Element) || <p>Loading...</p>;
	}

	if (error) {
		if (renderError) return renderError(error);
		return (
			<div>
				<h6>Bkash Loading Error</h6>
				<p>Error: {error.message}</p>
			</div>
		);
	}

	if (bkashNotfoundError) {
		if (renderError)
			return renderError(
				new Error(
					'Bkash was not found in window, please make sure you have provided the correct bkash.js  script url in	BkashComponent config prop'
				)
			);

		return (
			<p>
				Bkash was not found in window, please make sure you have provided the correct bkash.js script url in
				BkashComponent config prop
			</p>
		);
	}

	if (paymentAPIError) {
		if (renderError) return renderError(paymentAPIError);
		return (
			<div>
				<h6>There was a problem calling the payment API</h6>
				{debug && <p>Error Message: {paymentAPIError.message}</p>}
			</div>
		);
	}

	if (bkashButtonError) {
		if (renderError) return renderError(bkashButtonError);
		return (
			<div>
				<h6>There was a problem initiating a bKash create payment session</h6>
				{debug && <p>Error Message: {bkashButtonError.message}</p>}
			</div>
		);
	}

	if (data) {
		return <div>{cloneElement(children as ReactElement, { onClick: onClickHandler })}</div>;
	}

	return null;
};

export default BkashButton;

export * from './hooks/useAsync';
export * from './utils';
