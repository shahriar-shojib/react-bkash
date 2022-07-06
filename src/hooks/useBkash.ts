import { useCallback, useRef, useState } from 'react';
import { BkashConfig, BkashScript } from '../bkash.types';
import { loadDependencies } from '../utils';
import { ICreatePaymentResponse, IPaymentRequest } from '../utils/types';
import { useAsync } from './useAsync';

declare const bKash: BkashScript;

export type BkashHookConfig<T> = {
	onSuccess: (data: T) => void;
	onClose: () => void;
	bkashScriptURL: string;
	amount: number | string;
	onCreatePayment: (paymentRequest: IPaymentRequest) => Promise<ICreatePaymentResponse> | ICreatePaymentResponse;
	onExecutePayment: (paymentID: string) => T;
};

const BKASH_BUTTON_ID = 'bKash_button';

export const useBkash = <T>(config: BkashHookConfig<T>) => {
	const [componentError, setComponentError] = useState<Error | null>(null);
	const paymentID = useRef<string | null>(null);

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

	const initBkash = useCallback(async () => {
		createBkashButton();
		await loadDependencies(config.bkashScriptURL);

		const bkashConfig: BkashConfig = {
			paymentMode: 'checkout',
			paymentRequest: {
				amount: String(config.amount),
				intent: 'sale',
				currency: 'BDT',
			},

			createRequest: async (request) => {
				try {
					const result = await config.onCreatePayment(request);
					paymentID.current = result.paymentID;
					bKash.create().onSuccess(result);
				} catch (error) {
					setComponentError(error);
					bKash.create().onError();
				}
			},

			executeRequestOnAuthorization: async () => {
				if (!paymentID.current) {
					return setComponentError(new Error('No payment ID found'));
				}
				try {
					const result = await config.onExecutePayment(paymentID.current);
					config.onSuccess(result);
				} catch (error) {
					setComponentError(error);
					bKash.execute().onError();
				}
			},

			onClose: config.onClose,
		};

		if (typeof bKash === 'undefined') {
			setComponentError(new Error('bKash is not initialized properly, please provide a valid bKash script URL'));
			return;
		}

		bKash.init(bkashConfig);
	}, [config, createBkashButton]);

	const triggerBkash = useCallback((): void => {
		const createdButton = document.getElementById(BKASH_BUTTON_ID) as HTMLButtonElement;
		if (createdButton) {
			createdButton.click();
			createdButton.remove();
			return;
		}
		setComponentError(new Error('Could not find bkash button on document'));
	}, []);

	const { error, loading } = useAsync({ fn: initBkash });

	return {
		error: error || componentError,
		loading,
		triggerBkash,
	};
};
