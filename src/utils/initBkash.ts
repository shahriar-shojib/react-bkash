import { ICreatePaymentResponse, IExecutePaymentResponse, IPaymentRequest } from './interfaces';

interface BkashInitOptions {
	amount: string | number;
	createPaymentURL: string;
	executePaymentURL: string;
	onSuccess: (data: IExecutePaymentResponse) => void;
	onClose: () => void;
	additionalHeaders?: Record<string, string>;
}

export const initBkash = (options: BkashInitOptions): void => {
	const { additionalHeaders = {}, amount, createPaymentURL, executePaymentURL, onClose, onSuccess } = options;
	const config = {
		paymentMode: 'checkout',
		paymentRequest: {
			amount: String(amount),
			intent: 'sale',
			currency: 'BDT',
		},

		createRequest: async (request: IPaymentRequest) => {
			const data = await post<ICreatePaymentResponse>(createPaymentURL, request, additionalHeaders);
			if (data && data.paymentID !== null) {
				window.paymentID = data.paymentID;
				bKash.create().onSuccess(data);
			} else {
				bKash.create().onError();
			}
		},

		executeRequestOnAuthorization: async () => {
			const data = await post<IExecutePaymentResponse>(
				executePaymentURL,
				{ paymentID: window.paymentID },
				additionalHeaders
			);
			if (data && data.paymentID !== null) {
				onSuccess(data);
			} else {
				bKash.execute().onError();
			}
		},

		onClose: () => onClose(),
	};
	bKash.init(config);
};

export const createBkashButton = (): void => {
	const button = document.createElement('button');
	button.style.display = 'none';
	button.id = 'bKash_button';
	const body = document.querySelector('body');
	if (body) {
		body.appendChild(button);
		return;
	}
	throw new Error('Could not find document body to attach bkash button');
};

export const triggerBkash = (): void => {
	const createdButton = document.querySelector('#bKash_button') as HTMLButtonElement;
	if (createdButton) {
		createdButton.click();
		createdButton.remove();
		return;
	}
	throw new Error('Could not find bkash button on document');
};

async function post<T>(
	url: string,
	body: Record<string, string>,
	additionalHeaders: Record<string, string> = {}
): Promise<T> {
	return await fetch(url, {
		headers: {
			'content-type': 'application/json',
			...additionalHeaders,
		},
		method: 'POST',
		body: JSON.stringify(body),
	}).then((r) => r.json());
}
