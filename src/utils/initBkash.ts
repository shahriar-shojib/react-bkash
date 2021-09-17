/* eslint-disable no-undef */
//@ts-nocheck
declare global {
	interface Window {
		paymentID: string;
	}
}

import { ICreatePaymentResponse, IExecutePaymentResponse, IPaymentRequest } from './interfaces';

export const initBkash = (
	amount: string | number,
	createPaymentURL: string,
	executePaymentURL: string,
	onSuccess: (data: IExecutePaymentResponse) => void,
	onClose: () => void,
	additionalHeaders: Record<string, string> = {}
) => {
	const config = {
		paymentMode: 'checkout',
		paymentRequest: {
			amount: String(amount),
			intent: 'sale',
			currency:'BDT'
		},

		createRequest: async function (request: IPaymentRequest) {
			const data = await post<ICreatePaymentResponse>(createPaymentURL, request, additionalHeaders);
			if (data && data.paymentID !== null) {
				window.paymentID = data.paymentID;
				bKash.create().onSuccess(data);
			} else {
				bKash.create().onError();
			}
		},

		executeRequestOnAuthorization: async function () {
			const data = await post<IExecutePaymentResponse>(executePaymentURL, { paymentID: window.paymentID }, additionalHeaders);
			if (data && data.paymentID !== null) {
				onSuccess(data);
			} else {
				bKash.execute().onError();
			}
		},

		onClose: () => callBack(true),
	};
	bKash.init(config);
};
export const createBkashButton = (): void => {
	const button = document.createElement('button');
	button.style.display = 'none';
	button.id = 'bKash_button';
	document.querySelector('body').appendChild(button);
};
export const triggerBkash = (): void => {
	const createdButton = document.querySelector('#bKash_button')! as HTMLElement;
	createdButton.click();
	createdButton.remove();
};

async function post<T>(url: string, body: Record<string, string>, additionalHeaders: Record<string, string> = {}): Promise<T> {
	return await fetch(url, {
		headers: {
			'content-type': 'application/json',
			...additionalHeaders,
		},
		method: 'POST',
		body: JSON.stringify(body),
	}).then((r) => r.json());
}
