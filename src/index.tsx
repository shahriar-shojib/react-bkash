import React, {
	ReactElement,
	useState,
	FC,
	cloneElement,
	PropsWithChildren,
	useCallback,
	ReactNode,
	isValidElement,
} from 'react';
import { useAsync } from './hooks/useAsync';
import {
	loadDependencies,
	BkashSuccessFunction,
	BkashComponentConfig,
	IPaymentRequest,
	ICreatePaymentResponse,
	post,
	ExecutePaymentResponse,
} from './utils';

export type BkashButtonProps = {
	onSuccess: BkashSuccessFunction;
	onClose: () => void;
	config: BkashComponentConfig;

	/**
	 * Show a custom loader when bkash is initiating
	 */
	loader?: ReactNode;
	/**
	 * @default false
	 */
	showAPIErrors?: boolean;
};

const BKASH_BUTTON_ID = 'bKash_button';

export const BkashButton: FC<PropsWithChildren<BkashButtonProps>> = ({
	config,
	onClose,
	onSuccess,
	loader,
	children,
	showAPIErrors = false,
}): JSX.Element | null => {
	const [paymentID, setPaymentID] = useState('');
	const [bkashNotfoundError, setBkashNotFoundError] = useState(false);
	const [paymentAPIError, setPaymentAPIError] = useState<Error | null>(null);
	const [bkashButtonError, setBkashButtonError] = useState<Error | null>(null);

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

	// Load dependencies & setup bkash
	const { loading, data, error } = useAsync(async () => {
		createBkashButton();

		await loadDependencies(config.bkashScriptURL);
		initBkash();
		return true;
	});

	const triggerBkash = useCallback((): void => {
		const createdButton = document.getElementById(BKASH_BUTTON_ID) as HTMLButtonElement;
		if (createdButton) {
			createdButton.click();
			createdButton.remove();
			return;
		}
		setBkashButtonError(new Error('Could not find bkash button on document'));
	}, []);

	const initBkash = useCallback(() => {
		const { amount, createPaymentURL, executePaymentURL, additionalHeaders = {} } = config;
		const bkashConfig = {
			paymentMode: 'checkout',
			paymentRequest: {
				amount: String(amount),
				intent: 'sale',
				currency: 'BDT',
			},

			createRequest: async (request: IPaymentRequest) => {
				const result = await post<ICreatePaymentResponse>(createPaymentURL, request, additionalHeaders);
				if (result.error !== null) {
					window.bKash.create().onError();
					setPaymentAPIError(result.error);
					return;
				}
				setPaymentID(result.data.paymentID);
				window.bKash.create().onSuccess(result.data);
			},

			executeRequestOnAuthorization: async () => {
				const result = await post<ExecutePaymentResponse>(executePaymentURL, { paymentID }, additionalHeaders);
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

	/**
	 * Handler that clicks bkash button and also calls children's onClick handler if it exists
	 */
	const onClickHandler = useCallback(() => {
		if (isValidElement(children)) {
			children.props.onClick?.();
		}
		triggerBkash();
	}, [children, triggerBkash]);

	if (loading) {
		return (loader as JSX.Element) || <p>Loading...</p>;
	}

	if (error) {
		return (
			<div>
				<h6>Bkash Loading Error</h6>
				<p>Error: {error.message}</p>
			</div>
		);
	}

	if (bkashNotfoundError) {
		return (
			<p>
				Bkash was not found in window, please make sure you have provided the correct bkash.js script url in
				BkashComponent config prop
			</p>
		);
	}

	if (paymentAPIError) {
		return (
			<div>
				<h6>There was a problem calling the payment API</h6>
				{showAPIErrors && <p>Error Message: {paymentAPIError.message}</p>}
			</div>
		);
	}

	if (bkashButtonError) {
		return (
			<div>
				<h6>There was a problem initiating a bKash create payment session</h6>
				{showAPIErrors && <p>Error Message: {bkashButtonError.message}</p>}
			</div>
		);
	}

	if (data) {
		return <div>{cloneElement(children as ReactElement, { onClick: onClickHandler })}</div>;
	}

	return null;
};

export default BkashButton;

export * from './utils';
export * from './hooks/useAsync';
